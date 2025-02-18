import React, { useState, useEffect } from 'react';
import styles from './Store.module.css';
import CreateCanvasMap from '../../components/CreateCanvasMap/CreateCanvasMap';
import { Center, Tabs, TabList, TabPanels, Tab, TabPanel, Checkbox } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

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

// 동적 import를 위한 타입 정의
interface DynamicComponent {
  default: React.ComponentType<any>;
}

// 인터페이스 추가
interface PreviewState {
  background?: string;
  nameplate?: string;
  skin?: string;
}

export default function Store() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInventory, setUserInventory] = useState<Set<number>>(new Set());
  const [showOwnedItems, setShowOwnedItems] = useState(true);
  const navigate = useNavigate();
  const [loadedComponents, setLoadedComponents] = useState<{ [key: string]: React.ComponentType<any> }>({});
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

  useEffect(() => {
    Promise.all([fetchStoreItems(), fetchUserInventory(), fetchUserCurrentItems()]);
  }, []);

  const fetchStoreItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9999/api/store/items', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setItems(data);
      
      // 카테고리 추출 및 중복 제거 (전체 카테고리 추가)
      const uniqueCategories = Array.from(new Set(
        data.map((item: StoreItem) => item.itemCategory.split('-')[0])
      ));
      setCategories(['전체', ...uniqueCategories] as string[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInventory = async () => {
    try {
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
      
      const inventorySet = new Set(data.map(item => item.store.itemId));
      
      setUserInventory(new Set<number>(inventorySet));
    } catch (err) {
      console.error('Failed to fetch user inventory:', err);
    }
  };

  // 아이템 필터링 함수 수정
  const filterItemsByCategory = (category: string) => {
    let filteredItems = category === '전체' 
      ? items 
      : items.filter(item => item.itemCategory.startsWith(category));
    
    // 보유 중인 아이템과 미보유 아이템을 분리
    const ownedItems = filteredItems.filter(item => userInventory.has(item.itemId));
    const unownedItems = filteredItems.filter(item => !userInventory.has(item.itemId));
    
    // 보유 중인 아이템 표시 옵션에 따라 결과 반환
    if (!showOwnedItems) {
      return unownedItems;
    }
    
    // 미보유 아이템을 먼저, 보유 중인 아이템을 나중에 표시
    return [...unownedItems, ...ownedItems];
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

  // 구매 처리 함수 수정
  const handleBuyClick = async (item: StoreItem) => {
    try {
      // 로그인 상태 확인
      const response = await fetch('http://localhost:9999/api/user/user', {
        credentials: 'include',
        method: 'GET'
      });

      // 로그인되지 않은 경우
      if (response.status === 401 || response.status === 403 || response.status === 250) {
        const willLogin = window.confirm('로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?');
        if (willLogin) {
          window.location.href = '/login';
        }
        return;
      }

      // 구매 처리
      const buyResponse = await fetch(`http://localhost:9999/api/store/purchase?itemId=${item.itemId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (buyResponse.ok) {
        alert('구매가 완료되었습니다!');
        await Promise.all([fetchStoreItems(), fetchUserInventory()]);
      } else {
        const errorData = await buyResponse.text();
        alert(errorData);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    }
  };

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
      }
    } catch (err) {
      console.error('Error fetching current items:', err);
    }
  };

  useEffect(() => {
    fetchUserCurrentItems();
  }, []);

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
                <CreateCanvasMap imagePath={images(previewSkin)} />
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

  // 상품 카드 렌더링 함수 수정
  const renderProductCard = (item: StoreItem) => {
    const [category, number] = item.itemCategory.split('-');
    const isProfileItem = ['background', 'nameplate'].includes(category.toLowerCase());

    return (
      <div key={item.itemId} className={styles.productCard}>
        <div className={styles.imageWrapper}>
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
          <p className={styles.productPrice}>{item.price.toLocaleString()} Toks</p>
          <div className={styles.buttonGroup}>
            <button 
              className={styles.previewButton}
              onClick={() => handlePreview(item)}
            >
              미리보기
            </button>
            {userInventory.has(item.itemId) ? (
              <button className={styles.ownedButton} disabled>보유 중</button>
            ) : (
              <button 
                className={styles.buyButton} 
                onClick={() => handleBuyClick(item)}
              >
                구매하기
              </button>
            )}
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
                <h1 className={styles.title}>상점</h1>
              </div>
            </div>
            <div className={styles.filterOption}>
              <Checkbox 
                isChecked={showOwnedItems} 
                onChange={(e) => setShowOwnedItems(e.target.checked)}
              >
                보유 중인 아이템 표시
              </Checkbox>
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
                        {filterItemsByCategory(category).map(renderProductCard)}
                      </div>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </div>
          </div>
          <Center><footer>ⓒ TalkVillage Corp.</footer></Center>
        </div>
      </div>
    </div>
  );
} 