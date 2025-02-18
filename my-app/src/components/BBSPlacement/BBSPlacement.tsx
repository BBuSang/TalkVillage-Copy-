import React, { useState } from 'react';
import styles from "./BBSPlacement.module.css";
import ProfileComposition from "../../pages/ProfileComposition/ProfileComposition";

const BBSPlacement: React.FC = () => {
    return (
        <div className={styles.body}>
            <div className={styles.bodyInside}>
                <div className={styles.leftContainer}>
                    <div className={styles.leftContainderInside}>
                        <div className={styles.userContainer}>
                            <div className={styles.userContainerInside}>
                                <ProfileComposition />
                            </div>
                        </div>

                        <div className={styles.leftBottomContainer}>
                            <div className={styles.myWritingList}>내가 쓴 글</div>
                            <div className={styles.writingbutton}>글 쓰기</div>
                            <div className={styles.Category}>
                                <div>QnA</div>
                                <div>정보 공유 게시판</div>
                                <div>자유 게시판</div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.rightContainerInside}>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};


export default BBSPlacement;
