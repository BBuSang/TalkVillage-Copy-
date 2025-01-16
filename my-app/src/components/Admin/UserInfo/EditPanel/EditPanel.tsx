import React, { useState } from 'react';
import axios from 'axios';
import styles from './EditPanel.module.css';

interface EditPanelProps {
  selectedUser: User | null;
  onUserUpdate: (user: User) => void;
  onRefresh: () => void;
}

interface User {
  userId: number;
  email: string;
  pw: string;
  name: string;
  provider: string;
  birthdate: string;
  exp: number;
  point: number;
  grade: number;
  role: string;
}

const defaultUser: User = {
  userId: 0,
  email: '',
  pw: '',
  name: '',
  provider: '',
  birthdate: '',
  exp: 0,
  point: 0,
  grade: 0,
  role: 'ROLE_USER',
};

const EditPanel: React.FC<EditPanelProps> = ({ selectedUser, onUserUpdate, onRefresh }) => {
  const [error, setError] = useState<string | null>(null);

  const handleNumberChange = (field: keyof User, value: string) => {
    if (!selectedUser) return;
    const parsedValue = parseInt(value);
    onUserUpdate({
      ...selectedUser,
      [field]: isNaN(parsedValue) ? 0 : parsedValue,
    });
  };

  const handleUserUpdate = async () => {
    if (!selectedUser) return;
    setError(null);
    try {
      await axios.put(`http://localhost:9999/api/user/update/${selectedUser.userId}`, selectedUser);
      alert('사용자 정보가 성공적으로 업데이트되었습니다!');
      onRefresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || '사용자 정보를 업데이트하는 중 오류가 발생했습니다.');
      } else {
        setError('사용자 정보를 업데이트하는 중 알 수 없는 오류가 발생했습니다.');
      }
      console.error('Error updating user:', error);
    }
    
  };

  return (
    <div className={styles.rightSection}>
      <div className={styles.userInfoEditSection}>
        <h2>유저 정보 수정</h2>
        
        <div className={styles.formGrid}>
          <label>
            이메일:
            <input
              type="email"
              value={selectedUser?.email || defaultUser.email}
              className={styles.userInfoEditInput}
              disabled
            />
          </label>

          <label>
            이름:
            <input
              type="text"
              value={selectedUser?.name || defaultUser.name}
              onChange={(e) => onUserUpdate({ ...(selectedUser || defaultUser), name: e.target.value })}
              className={styles.userInfoEditInput}
            />
          </label>

          <label>
            생년월일:
            <input
              type="date"
              value={selectedUser?.birthdate || defaultUser.birthdate}
              onChange={(e) => onUserUpdate({ ...(selectedUser || defaultUser), birthdate: e.target.value })}
              className={styles.userInfoEditInput}
            />
          </label>



          <label>
            경험치:
            <input
              type="number"
              value={selectedUser?.exp || defaultUser.exp}
              onChange={(e) => handleNumberChange('exp', e.target.value)}
              className={styles.userInfoEditInput}
            />
          </label>

          <label>
            포인트:
            <input
              type="number"
              value={selectedUser?.point || defaultUser.point}
              onChange={(e) => handleNumberChange('point', e.target.value)}
              className={styles.userInfoEditInput}
            />
          </label>

          <label>
            권한:
            <select
              value={selectedUser?.role || defaultUser.role}
              onChange={(e) => onUserUpdate({ ...(selectedUser || defaultUser), role: e.target.value })}
              className={styles.userInfoEditInput}
            >
              <option value="ROLE_USER">일반 사용자</option>
              <option value="ROLE_ADMIN">관리자</option>
            </select>
          </label>
          <label>
            가입 경로:
            <input
              type="text"
              value={selectedUser?.provider || defaultUser.provider}
              className={styles.userInfoEditInput}
              disabled
            />
          </label>
          {selectedUser && (
            <button onClick={handleUserUpdate} className={`${styles.saveButton} ${styles.fullWidth}`}>
              저장
            </button>
          )}
          {error && <div className={`${styles.error} ${styles.fullWidth}`}>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default EditPanel; 