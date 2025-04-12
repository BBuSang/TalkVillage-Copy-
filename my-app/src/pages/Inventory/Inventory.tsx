import React, { useState, useEffect } from 'react';
import styles from './Inventory.module.css';
import CreateCanvasMap from '../../components/CreateCanvasMap/CreateCanvasMap';
import { Center, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

declare const require: {
  context: (
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ) => any;
};

const images = require.context('../../image', true, /\.(png|jpe?g|svg)$/);

interface StoreItem {
  itemId: number;
  itemName: string;
  itemCategory: string;
  price: number;
  image: string;
}

interface UserData {
  userId: number;
  email: string;
  pw: string;
  name: string;
  provider: string;
}

interface UserInventory {
  inventoryId: number;
  state: boolean;
  store: StoreItem;
  user: UserData;
}

interface PreviewState {
  background?: string;
  nameplate?: string;
  skin?: string;
}

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState<UserInventory[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPreview, setCurrentPreview] = useState<PreviewState>({});
  const [userCurrentItems, setUserCurrentItems] = useState<PreviewState>({});

  const handlePreview = (item: StoreItem) => {
    const [category, number] = item.itemCategory.split('-');
    const categoryKey = category.toLowerCase() as keyof PreviewState;
    
    if (category.toLowerCase() === 'skin') {
      setCurrentPreview(prev => ({
        ...prev,
        [categoryKey]: item.image
      }));
    } else {
      setCurrentPreview(prev => ({
        ...prev,
        [categoryKey]: number
      }));
    }
  };

  const fetchUserCurrentItems = async () => {
    try {
      const userResponse = await fetch('http://localhost:9999/api/user/user', {
        credentials: 'include'
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await userResponse.json();

      const inventoryResponse = await fetch(`http://localhost:9999/api/user/inventory?userId=${userData.userId}`, {
        credentials: 'include'
      });

      if (inventoryResponse.ok) {
        const inventoryData: UserInventory[] = await inventoryResponse.json();
        const activeItems = inventoryData.filter(item => item.state === true);

        const currentItems: PreviewState = {};

        activeItems.forEach(item => {
          const [category, number] = item.store.itemCategory.split('-');
          const categoryKey = category.toLowerCase() as keyof PreviewState;

          if (category.toLowerCase() === 'skin') {
            currentItems[categoryKey] = item.store.image;
          } else {
            currentItems[categoryKey] = number;
          }
        });

        setUserCurrentItems(currentItems);
        setCurrentPreview(currentItems);
        return currentItems;
      }
    } catch (err) {
      console.error('Error fetching current items:', err);
      return null;
    }
  };

  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      const userResponse = await fetch('http://localhost:9999/api/user/user', {
        credentials: 'include'
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await userResponse.json();

      const inventoryResponse = await fetch(`http://localhost:9999/api/user/inventory?userId=${userData.userId}`, {
        credentials: 'include'
      });

      if (!inventoryResponse.ok) {
        throw new Error(`HTTP error! status: ${inventoryResponse.status}`);
      }

      const data: UserInventory[] = await inventoryResponse.json();
      setInventoryItems(data);

      const uniqueCategories = Array.from(new Set(
        data.map(item => item.store.itemCategory.split('-')[0])
      ));
      setCategories(['전체', ...uniqueCategories] as string[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeInventory = async () => {
      try {
        setLoading(true);
        const currentItems = await fetchUserCurrentItems();
        if (currentItems) {
          setCurrentPreview(currentItems);
        }
        await fetchInventoryItems();
      } catch (error) {
        console.error('Error initializing inventory:', error);
        setError('초기 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    initializeInventory();
  }, []);

  const filterItemsByCategory = (category: string) => {
    return category === '전체'
      ? inventoryItems
      : inventoryItems.filter(item => item.store.itemCategory.startsWith(category));
  };

  const loadComponent = async (category: string, number: string): Promise<React.ComponentType<any> | null> => {
    try {
      let Component;
      
      if (category.toLowerCase() === 'background') {
        Component = (await import(`../../components/Profile/BackgroundItems/Background${number}`)).default;
      } else if (category.toLowerCase() === 'nameplate') {
        Component = (await import(`../../components/Profile/NamePlateItems/NamePlate${number}`)).default;
      } else {
        return null;
      }

      return Component;
    } catch (error) {
      console.error(`Failed to load component for ${category}-${number}:`, error);
      return null;
    }
  };

  const ProfileComponent = React.memo(({ category, number, itemName }: { 
    category: string; 
    number: string; 
    itemName: string;
  }) => {
    const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

    useEffect(() => {
      const loadAndSetComponent = async () => {
        const comp = await loadComponent(category, number);
        if (comp) {
          setComponent(() => comp);
        }
      };
      loadAndSetComponent();
    }, [category, number]);

    if (!Component) {
      return <div>Loading...</div>;
    }

    return category.toLowerCase() === 'nameplate' 
      ? <Component name={itemName} />
      : <Component />;
  });

  const PreviewSection = React.memo(() => {
    const previewBackground = currentPreview.background || userCurrentItems.background;
    const previewNameplate = currentPreview.nameplate || userCurrentItems.nameplate;
    const previewSkin = currentPreview.skin || userCurrentItems.skin;

    const MemoizedCreateCanvasMap = React.useMemo(() => {
      return previewSkin && (
        <CreateCanvasMap imagePath={images(previewSkin)} />
      );
    }, [previewSkin]);

    const MemoizedBackgroundComponent = React.useMemo(() => {
      return previewBackground && (
        <ProfileComponent
          category="Background"
          number={previewBackground}
          itemName=""
        />
      );
    }, [previewBackground]);

    const MemoizedNameplateComponent = React.useMemo(() => {
      return previewNameplate && (
        <ProfileComponent
          category="NamePlate"
          number={previewNameplate}
          itemName="사용자 이름"
        />
      );
    }, [previewNameplate]);

    return (
      <div className={styles.previewSection}>
        <h2>미리보기</h2>
        <div className={styles.previewArea}>
          <div className={styles.backgroundPreview}>
            {MemoizedBackgroundComponent}
            <div className={styles.characterWrapper}>
              <div className={styles.characterBox}>
                {MemoizedCreateCanvasMap}
              </div>
              {previewNameplate && (
                <div className={`${styles.nameBox} ${styles.noBackground}`}>
                  {MemoizedNameplateComponent}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, (prevProps, nextProps) => {
    return true;
  });

  const handleEquipToggle = async (inventoryItem: UserInventory) => {
    try {
      const response = await fetch('http://localhost:9999/api/user/inventory/state', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          inventoryId: inventoryItem.inventoryId,
          userId: inventoryItem.user.userId,
          category: inventoryItem.store.itemCategory.split('-')[0]
        }),
      });

      if (response.ok) {
        const currentItems = await fetchUserCurrentItems();
        if (currentItems) {
          setCurrentPreview(currentItems);
        }
        await fetchInventoryItems();
      } else {
        alert('아이템 장착 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error toggling item state:', error);
      alert('아이템 장착 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const renderInventoryCard = (inventoryItem: UserInventory) => {
    const item = inventoryItem.store;
    const [category, number] = item.itemCategory.split('-');
    const isProfileItem = ['background', 'nameplate'].includes(category.toLowerCase());

    return (
      <div key={inventoryItem.inventoryId} className={styles.productCard}>
        <div className={styles.imageWrapper} data-type={category.toLowerCase()}>
          {isProfileItem ? (
            <ProfileComponent 
              category={category} 
              number={number} 
              itemName={item.itemName}
            />
          ) : (
            <CreateCanvasMap imagePath={images(item.image)} />
          )}
        </div>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{item.itemName}</h3>
          <div className={styles.buttonGroup}>
            <button 
              className={styles.previewButton}
              onClick={() => handlePreview(item)}
            >
              미리보기
            </button>
            <button
              className={inventoryItem.state ? styles.activeButton : styles.inactiveButton}
              onClick={() => handleEquipToggle(inventoryItem)}
              disabled={inventoryItem.state}
            >
              {inventoryItem.state ? '장착 중' : '장착하기'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>에러: {error}</div>;

  return (
    <div className={styles.mainMapView}>
      <div className={styles.viewSize}>
        <div className={styles.insideView}>
          <header className={styles.header}>
            <div className={styles.logoBorder}>
              <div>
                <h1 className={styles.title}>인벤토리</h1>
              </div>
            </div>
          </header>
          
          <div className={styles.storeLayout}>
            <div className={styles.previewContainer}>
              <PreviewSection />
            </div>
            <div className={styles.storeContainer}>
              <Tabs isFitted variant="line">
                <TabList mb="1em">
                  {categories.map((category) => (
                    <Tab key={category}>{category}</Tab>
                  ))}
                </TabList>

                <TabPanels>
                  {categories.map((category) => (
                    <TabPanel key={category}>
                      <div className={styles.productGrid}>
                        {filterItemsByCategory(category).map(renderInventoryCard)}
                      </div>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 