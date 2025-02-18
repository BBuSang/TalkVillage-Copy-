import React, { useState } from 'react';
import styles from './DeleteID.module.css';
import { useNavigate } from 'react-router-dom';

interface DeleteIDProps {
    userInfo: any;
}

const DeleteID: React.FC<DeleteIDProps> = ({ userInfo }) => {
    const [showFirstConfirm, setShowFirstConfirm] = useState(false);
    const [showFinalConfirm, setShowFinalConfirm] = useState(false);
    const navigate = useNavigate();

    const handleInitialDelete = () => {
        setShowFirstConfirm(true);
    };

    const handleFirstConfirm = () => {
        setShowFirstConfirm(false);
        setShowFinalConfirm(true);
    };

    const handleFinalDelete = async () => {
        try {
            const response = await fetch('http://localhost:9999/api/user/delete', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                fetch('http://localhost:9999/api/logout', {
                    method: 'POST',
                    credentials: 'include',
                });
                navigate('/login');
            } else {
                alert('계정 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };

    const handleCancel = () => {
        setShowFirstConfirm(false);
        setShowFinalConfirm(false);
    };

    return (
        <div className={styles.deletePanel}>
            <div className={styles.deletePanelContent}>
                <h2>계정 삭제</h2>
                
                <button 
                    onClick={handleInitialDelete}
                    className={styles.deleteButton}
                >
                    계정 삭제하기
                </button>

                {showFirstConfirm && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>계정 삭제 확인</h3>
                            <p>정말로 계정을 삭제하시겠습니까?</p>
                            <p>삭제된 계정은 복구할 수 없습니다.</p>
                            <div className={styles.modalButtons}>
                                <button 
                                    onClick={handleFirstConfirm}
                                    className={styles.confirmButton}
                                >
                                    예
                                </button>
                                <button 
                                    onClick={handleCancel}
                                    className={styles.cancelButton}
                                >
                                    아니오
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showFinalConfirm && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>최종 확인</h3>
                            <p className={styles.warningText}>⚠️ 경고</p>
                            <p>이 작업은 되돌릴 수 없습니다.</p>
                            <p>모든 데이터가 영구적으로 삭제됩니다.</p>
                            <div className={styles.modalButtons}>
                                <button 
                                    onClick={handleFinalDelete}
                                    className={styles.deleteConfirmButton}
                                >
                                    삭제하기
                                </button>
                                <button 
                                    onClick={handleCancel}
                                    className={styles.cancelButton}
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.warningContainer}>
                    <div className={styles.warningIcon}>!</div>
                    <div className={styles.warningTextContainer}>
                        <div className={styles.warningTitle}>
                            계정 삭제 시 유의사항
                        </div>
                        <div className={styles.warningText}>
                            <p>• 계정 삭제 시 모든 개인정보가 즉시 삭제됩니다.</p>
                            <p>• 삭제된 계정은 복구가 불가능합니다.</p>
                            <p>• 작성한 게시물과 댓글은 자동으로 삭제되지 않습니다.</p>
                            <p>• 연동된 소셜 계정이 있다면 연동이 해제됩니다.</p>
                            <p>• 진행 중인 거래나 문의가 있다면 먼저 처리해주세요.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteID; 