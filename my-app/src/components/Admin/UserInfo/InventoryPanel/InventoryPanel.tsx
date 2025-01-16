import React, { useState, useEffect } from 'react';
import styles from './InventoryPanel.module.css';
import CreateCanvasMap from '../../../../components/CreateCanvasMap/CreateCanvasMap';

interface Store {
  itemId: number;
  itemName: string;
  itemCategory: string;
  price: number;
  image: string;
}

interface Inventory {
  inventoryId: number;
  state: boolean;
  user: {
    userId: number;
    email: string;
  };
  store: Store | null;
}

interface InventoryPanelProps {
  userId?: number;
}

interface StoreItem {
  itemId: number;
  itemName: string;
  itemCategory: string;
  price: number;
  image: string;
}

// 아이템 미리보기를 위한 공통 함수 추가
const renderItemPreview = (item: Store | StoreItem, userName?: string) => {
  const category = item.itemCategory.split('-')[0];
  const itemNumber = item.itemCategory.split('-')[1];
  
  if (category === 'Background') {
    const BackgroundComponent = React.lazy(() => 
      import(`../../../Profile/BackgroundItems/Background${itemNumber}`));
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <BackgroundComponent />
      </React.Suspense>
    );
  }
  
  if (category === 'NamePlate') {
    const NamePlateComponent = React.lazy(() => 
      import(`../../../Profile/NamePlateItems/NamePlate${itemNumber}`));
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <NamePlateComponent name={item.itemName} />
      </React.Suspense>
    );
  }

  // 스킨 이미지 렌더링
  return item.image && (
    <img src={`/${item.image}`} alt={item.itemName} />
  );
};

const InventoryPanel: React.FC<InventoryPanelProps> = ({ userId }) => {
  const [inventoryItems, setInventoryItems] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedInventoryCategory, setSelectedInventoryCategory] = useState<string>('all');

  const fetchInventory = async () => {
    if (userId === undefined) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:9999/api/user/inventory?userId=${userId}`);
      
      if (!response.ok && response.status !== 201) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (response.status === 201) {
        setInventoryItems([]);
        return;
      }
      
      const data = await response.json();
      
      // 데이터가 배열인 경우 그대로 사용, 아닌 경우 배열로 변환
      const inventoryData = Array.isArray(data) ? data : [data];
      setInventoryItems(inventoryData);
      
    } catch (err) {
      console.error('Error details:', err);
      setError('인벤토리 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [userId]);

  const handleDelete = async (inventoryId: number) => {
    if (!window.confirm('정말로 이 아이템을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:9999/api/user/inventory?inventoryId=${inventoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchInventory();
    } catch (err) {
      console.error('Delete error:', err);
      setError('아이템 삭제에 실패했습니다.');
    }
  };

  const fetchStoreItems = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/store/items');
      if (!response.ok) throw new Error('상점 아이템을 불러오는데 실패했습니다.');
      const data = await response.json();
      setStoreItems(data);
    } catch (err) {
      console.error('Store items fetch error:', err);
    }
  };

  useEffect(() => {
    fetchStoreItems();
  }, []);

  const handleGiveItem = async (itemId: number) => {
    if (userId === undefined) return;
    
    try {
      const response = await fetch('http://localhost:9999/api/user/inventory/give', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          itemId: itemId
        })
      });

      if (response.status === 409) {
        alert('이미 보유한 아이템입니다.');
        return;
      }

      if (!response.ok) throw new Error('아이템 지급에 실패했습니다.');
      
      fetchInventory();
    } catch (err) {
      console.error('Item give error:', err);
      setError('아이템 지급에 실패했습니다.');
    }
  };

  const handleStateToggle = async (inventoryId: number, currentState: boolean, category: string) => {
    if (!currentState) { 
      try {
        // 먼저 UI 업데이트
        setLoading(true);

        const response = await fetch(`http://localhost:9999/api/user/inventory/state`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inventoryId,
            category,
            userId
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update item state');
        }

        // 병렬로 데이터 fetch
        await Promise.all([
          fetchInventory(),
          // 프로필 업데이트 이벤트 즉시 발생
          window.dispatchEvent(new Event('profileUpdate'))
        ]);

      } catch (err) {
        console.error('Error updating item state:', err);
        setError('아이템 상태 변경에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }
  };

  const categories = ['all', ...Array.from(new Set(storeItems.map(item => item.itemCategory.split('-')[0])))];
  const inventoryCategories = ['all', ...Array.from(new Set(
    inventoryItems
      .filter(item => item.store)
      .map(item => item.store!.itemCategory.split('-')[0])
  ))];

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (userId === undefined) return <div className={styles.error}>사용자를 선택해주세요.</div>;

  return (
    <div className={styles.inventoryPanel}>
      <div className={styles.section}>
        <div className={styles.categoryFilter}>
          {inventoryCategories.map(category => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedInventoryCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedInventoryCategory(category)}
            >
              {category === 'all' ? '전체' : category}
            </button>
          ))}
        </div>
        <div className={styles.inventoryGrid}>
          {inventoryItems.length === 0 ? (
            <div className={styles.noItems}>보유한 아이템이 없습니다.</div>
          ) : (
            inventoryItems
              .filter(inventory => 
                selectedInventoryCategory === 'all' || 
                inventory.store?.itemCategory.split('-')[0] === selectedInventoryCategory
              )
              .map((inventory) => {
                if (!inventory.store) {
                  return (
                    <div key={inventory.inventoryId} className={`${styles.inventoryItem} ${styles.invalidItem}`}>
                      <div className={styles.itemHeader}>
                        <h3>삭제된 아이템</h3>
                        <span className={`${styles.state} ${inventory.state ? styles.active : styles.inactive}`}>
                          {inventory.state ? '사용 중' : '미사용'}
                        </span>
                      </div>
                      <div className={styles.itemInfo}>
                        <p>아이템 정보를 찾을 수 없습니다.</p>
                      </div>
                      <div className={styles.itemActions}>
                        <button 
                          onClick={() => handleDelete(inventory.inventoryId)}
                          className={styles.deleteButton}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={inventory.inventoryId} className={styles.inventoryItem}>
                    <div className={styles.itemHeader}>
                      <h3>{inventory.store.itemName}</h3>
                      <span className={`${styles.state} ${inventory.state ? styles.active : styles.inactive}`}>
                        {inventory.state ? '사용 중' : '미사용'}
                      </span>
                    </div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemImageContainer}>
                        {renderItemPreview(inventory.store!, inventory.user.email)}
                      </div>
                      <div className={styles.itemDetails}>
                        <p>아이템 유형: {inventory.store.itemCategory.split('-')[0]}</p>
                        <p>가격: {inventory.store.price}</p>
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <button 
                        onClick={() => handleDelete(inventory.inventoryId)}
                        className={styles.deleteButton}
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => inventory.store && handleStateToggle(
                          inventory.inventoryId, 
                          inventory.state, 
                          inventory.store.itemCategory.split('-')[0]
                        )}
                        className={`${styles.stateButton} ${inventory.state ? styles.active : ''}`}
                      >
                        {inventory.state ? '사용 중' : '장착'}
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.categoryFilter}>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? '전체' : category}
            </button>
          ))}
        </div>
        <div className={styles.storeGrid}>
          {storeItems
            .filter(item => selectedCategory === 'all' || item.itemCategory.split('-')[0] === selectedCategory)
            .map(item => (
              <div key={item.itemId} className={styles.storeItem}>
                <div className={styles.itemHeader}>
                  <h3>{item.itemName}</h3>
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemImageContainer}>
                    {renderItemPreview(item)}
                  </div>
                  <div className={styles.itemDetails}>
                    <p>유형: {item.itemCategory}</p>
                    <p>가격: {item.price}</p>
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <button 
                    onClick={() => handleGiveItem(item.itemId)}
                    className={styles.giveButton}
                  >
                    지급하기
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryPanel; 