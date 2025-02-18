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
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('http://localhost:9999/api/user/useingprofile', {
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        const uniqueData = Array.from(new Set(data)) as string[];
        
        // 스토리지에서 닉네임 확인
        const storedNickname = sessionStorage.getItem('userNickname');
        
        setUsingItems({
          name: storedNickname || uniqueData[0], // 저장된 닉네임이 있으면 사용, 없으면 API 응답 사용
          background: uniqueData.find((item: string) => item.includes('Background-'))?.split('Background-')[1] || '0',
          nameplate: uniqueData.find((item: string) => item.includes('NamePlate-'))?.split('NamePlate-')[1] || '0',
          skin: uniqueData.find((item: string) => 
            item.includes('./basicSkin/') || item.includes('/cha_skins/')
          )?.trim().replace('./', '/') || '/basicSkin/Login.png'
        });
      }
    } catch (error) {
      console.error('Error fetching using items:', error);
      // 에러가 발생해도 기본값으로 설정
      const storedNickname = sessionStorage.getItem('userNickname');
      if (storedNickname) {
        setUsingItems({
          name: storedNickname,
          background: '0',
          nameplate: '0',
          skin: '/basicSkin/Login.png'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsingItems();
  }, []);

  // profileUpdate 이벤트 리스너만 유지
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