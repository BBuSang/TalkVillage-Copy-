import { Box, Button } from '@chakra-ui/react';
import React from 'react';
import styles from './NavigationButtons.module.css';

interface NavigationButtonsProps {
  type: 'next' | 'prev';  // type의 값으로 'next' 또는 'prev'만 허용
  clicked: () => void;
  disabled: boolean; // disabled 속성 추가
}

function NavigationButtons({ type, clicked, disabled }: NavigationButtonsProps): JSX.Element | null {
  if (type === 'next') {
    return (
      <Button
        children='다음'
        className={styles.buttonContainer}
        onClick={clicked}
        position={'absolute'}
        right={'5vw'}
        isDisabled={disabled} // Chakra UI에서 disabled 상태를 설정
         border="2px" borderColor="black" borderRadius="3xl"
         bg="white"
      />
    );
  } else if (type === 'prev') {
    return (
      <Button
        children='이전'
        className={styles.buttonContainer}
        onClick={clicked}
        position={'absolute'}
        left={'5vw'}
        isDisabled={disabled} // Chakra UI에서 disabled 상태를 설정
         border="2px" borderColor="black" borderRadius="3xl"
         bg="white"
      />
    );
  }
  return null;
}

export default NavigationButtons;
