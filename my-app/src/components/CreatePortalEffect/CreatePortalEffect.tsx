import React from "react";
import styles from "./CreatePortalEffect.module.css";

const PortalFrame: React.FC = () => {
  return (
    <div className={styles.portalFrame}>
      <div className={styles.portal}></div>
    </div>
  );
};

export default PortalFrame;
