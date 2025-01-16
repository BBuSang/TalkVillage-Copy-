import React, { useEffect, useState } from 'react';
import styles from './ProfileComposition.module.css';

interface UsingItems {
  background: string;
  skin: string;
  nameplate: string;
  name: string;
}

const ProfileComposition: React.FC = () => {
  const [usingItems, setUsingItems] = useState<UsingItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsingItems = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃

      const response = await fetch('http://localhost:9999/api/user/useingprofile', {
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        const uniqueData = Array.from(new Set(data)) as string[];
        
        setUsingItems({
          name: uniqueData[0],
          background: uniqueData.find((item: string) => item.includes('Background-'))?.split('Background-')[1] || '0',
          nameplate: uniqueData.find((item: string) => item.includes('NamePlate-'))?.split('NamePlate-')[1] || '0',
          skin: uniqueData.find((item: string) => 
            item.includes('./basicSkin/') || item.includes('/cha_skins/')
          )?.trim().replace('./', '/') || '/basicSkin/Login.png'
        });
      }
    } catch (error) {
      console.error('Error fetching using items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsingItems();
  }, []);

  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUsingItems();
    };

    window.addEventListener('profileUpdate', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdate', handleProfileUpdate);
    };
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  // 배경 컴포넌트 동적 import
  const BackgroundComponent = React.lazy(() => 
    import(`../../components/Profile/BackgroundItems/Background${usingItems?.background || '0'}`));

  // 이름표 컴포넌트 동적 import
  const NamePlateComponent = React.lazy(() => 
    import(`../../components/Profile/NamePlateItems/NamePlate${usingItems?.nameplate || '0'}`));

  return (
    <div className={styles.cardWrapper}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <BackgroundComponent />
      </React.Suspense>
      <div className={styles.skinLayer}>
        <img 
          src={usingItems?.skin || '/basicSkin/Login.png'}
          alt="캐릭터 스킨" 
        />
      </div>
      <div className={styles.nameplateLayer}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <NamePlateComponent name={usingItems?.name || 'null'} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default ProfileComposition; 