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

  // 현재 사용자가 사용 중인 아이템 정보 가져오기
  const fetchUserCurrentItems = async () => {
    try {
      // 먼저 현재 로그인한 사용자 정보 가져오기
      const userResponse = await fetch('http://localhost:9999/api/user/user', {
        credentials: 'include'
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await userResponse.json();

      // 사용자의 인벤토리에서 state가 true인 아이템들 가져오기
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

  // 초기 데이터 로딩
  useEffect(() => {
    const initializeInventory = async () => {
      try {
        setLoading(true);
        // 먼저 현재 장착 중인 아이템을 가져옴
        await fetchUserCurrentItems();
        // 그 다음 인벤토리 아이템을 가져옴
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

  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      // 먼저 현재 로그인한 사용자 정보 가져오기
      const userResponse = await fetch('http://localhost:9999/api/user/user', {
        credentials: 'include'
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await userResponse.json();

      // 사용자의 인벤토리 가져오기
      const inventoryResponse = await fetch(`http://localhost:9999/api/user/inventory?userId=${userData.userId}`, {
        credentials: 'include'
      });

      if (!inventoryResponse.ok) {
        throw new Error(`HTTP error! status: ${inventoryResponse.status}`);
      }

      const data: UserInventory[] = await inventoryResponse.json();
      setInventoryItems(data);

      // 카테고리 추출 및 중복 제거
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

  // 아이템 필터링 함수
  const filterItemsByCategory = (category: string) => {
    return category === '전체'
      ? inventoryItems
      : inventoryItems.filter(item => item.store.itemCategory.startsWith(category));
  };

  // 상점으로 가기 카드 렌더링 함수
  const renderStoreCard = () => {
    return (
      <div className={`${styles.productCard} ${styles.storeCard}`}>
        <div className={`${styles.imageWrapper} ${styles.storeImageWrapper}`}>
          <div className={styles.storeIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
              <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z" />
            </svg>
          </div>
        </div>
        <div className={styles.productInfo}>
          <h3 className={styles.storeName}>더 많은 아이템이 필요하신가요?</h3>
          <p className={styles.storeDescription}>상점에서 새로운 아이템을 구경해보세요!</p>
          <div className={styles.buttonGroup}>
            <button
              className={styles.storeButton}
              onClick={() => window.location.href = '/store'}
            >
              <span className={styles.storeButtonText}>상점으로 이동</span>
              <span className={styles.storeButtonIcon}>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 동적으로 컴포넌트를 로드하는 함수
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

  // 프로필 컴포넌트를 렌더링하는 함수
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

  // 미리보기 렌더링 컴포넌트
  const PreviewSection = () => {
    const previewBackground = currentPreview.background || userCurrentItems.background;
    const previewNameplate = currentPreview.nameplate || userCurrentItems.nameplate;
    const previewSkin = currentPreview.skin || userCurrentItems.skin;

    return (
      <div className={styles.previewSection}>
        <h2>미리보기</h2>
        <div className={styles.previewArea}>
          <div className={styles.backgroundPreview}>
            {previewBackground && (
              <ProfileComponent
                category="Background"
                number={previewBackground}
                itemName=""
              />
            )}
          </div>
          <div className={styles.characterWrapper}>
            <div className={styles.characterBox}>
              {previewSkin && (
                <CreateCanvasMap imagePath={`.${previewSkin}`} />
              )}
              {previewNameplate && (
                <div className={`${styles.nameBox} ${styles.noBackground}`}>
                  <ProfileComponent
                    category="NamePlate"
                    number={previewNameplate}
                    itemName="사용자 이름"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 상품 카드 렌더링 함수
  const renderInventoryCard = (inventoryItem: UserInventory) => {
    const item = inventoryItem.store;
    const [category, number] = item.itemCategory.split('-');
    const isProfileItem = ['background', 'nameplate'].includes(category.toLowerCase());

    return (
      <div key={inventoryItem.inventoryId} className={styles.productCard}>
        <div className={styles.imageWrapper}>
          {isProfileItem ? (
            <ProfileComponent
              category={category}
              number={number}
              itemName={item.itemName}
            />
          ) : (
            <CreateCanvasMap imagePath={`.${item.image}`} />
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
        // 상태 변경 후 현재 장착 아이템과 미리보기 모두 업데이트
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

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>에러: {error}</div>;

  return (
    <div className={styles.outsidecontainer}>
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
    </div>
  );
} 