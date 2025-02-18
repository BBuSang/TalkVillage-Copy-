import React, { useState } from 'react';
import styles from './LogoPanel.module.css';
import {Box, Image} from '@chakra-ui/react';
import LogoImage from '../../image/logos/TalkVillageLogo.svg';


export default function LogoPanel() {
  return (
  <Box className={styles.LogoBox}>
    <Image src={LogoImage} alt="Talk Village Logo" />
  </Box>);
}
