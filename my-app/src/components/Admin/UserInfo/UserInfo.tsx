import React, { useState } from 'react';
import styles from './UserInfo.module.css';
import SearchPanel from './SearchPanel/SearchPanel';
import EditPanel from './EditPanel/EditPanel';
import InventoryPanel from './InventoryPanel/InventoryPanel';
import StagePanel from './StagePanel/StagePanel';
import AchievementPanel from './AchievementPanel/AchievementPanel';
import { User } from '../../../types/user.types';

type PanelType = 'info' | 'inventory' | 'stage' | 'achievement';

const UserInfo: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activePanel, setActivePanel] = useState<PanelType>('info');
  const [searchTrigger, setSearchTrigger] = useState(0);

  const handleRefresh = () => {
    setSearchTrigger(prev => prev + 1);
  };

  const renderPanel = () => {
    if (!selectedUser) {
      return <div className={styles.noUserSelected}>사용자를 선택해주세요</div>;
    }

    switch (activePanel) {
      case 'info':
        return <EditPanel selectedUser={selectedUser} onUserUpdate={setSelectedUser} onRefresh={handleRefresh} />;
      case 'inventory':
        return <InventoryPanel userId={selectedUser?.userId} />;
      case 'stage':
        return <StagePanel userId={selectedUser?.userId} />;
      case 'achievement':
        return <AchievementPanel userId={selectedUser?.userId} />;
      default:
        return <EditPanel selectedUser={selectedUser} onUserUpdate={setSelectedUser} onRefresh={handleRefresh} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <SearchPanel onUserSelect={setSelectedUser} searchTrigger={searchTrigger} />
      </div>
      <div className={styles.contentSection}>
        <div className={styles.panelButtons}>
          <button
            className={`${styles.panelButton} ${activePanel === 'info' ? styles.active : ''}`}
            onClick={() => setActivePanel('info')}
            disabled={!selectedUser}
          >
            기본 정보
          </button>
          <button
            className={`${styles.panelButton} ${activePanel === 'inventory' ? styles.active : ''}`}
            onClick={() => setActivePanel('inventory')}
            disabled={!selectedUser}
          >
            인벤토리
          </button>
          <button
            className={`${styles.panelButton} ${activePanel === 'stage' ? styles.active : ''}`}
            onClick={() => setActivePanel('stage')}
            disabled={!selectedUser}
          >
            스테이지 정보
          </button>
          <button
            className={`${styles.panelButton} ${activePanel === 'achievement' ? styles.active : ''}`}
            onClick={() => setActivePanel('achievement')}
            disabled={!selectedUser}
          >
            업적
          </button>
        </div>
        <div className={styles.panelContainer}>
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};

export default UserInfo; 