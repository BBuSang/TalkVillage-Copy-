
import React from 'react';
import {
  Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent,
  DrawerCloseButton, Button, useDisclosure, SimpleGrid, Image, Box, Text
} from '@chakra-ui/react';
import Airport from '../../../image/ThemeImages/Airport.svg';
import Cabin from '../../../image/ThemeImages/Cabin.svg';
import Directions from '../../../image/ThemeImages/Directions.svg';
import Hotel from '../../../image/ThemeImages/Hotel.svg';
import Restaurant from '../../../image/ThemeImages/Restaurant.svg';
import Shopping from '../../../image/ThemeImages/Shopping.svg';
import Tour from '../../../image/ThemeImages/Tour.svg';
import Transportation from '../../../image/ThemeImages/Transportation.svg';

const imageSources = [
  { src: Airport, label: '공항', id: '1000' },
  { src: Cabin, label: '기내', id: '1001' },
  { src: Directions, label: '길찾기', id: '1002' },
  { src: Hotel, label: '호텔', id: '1003' },
  { src: Restaurant, label: '식당', id: '1004' },
  { src: Shopping, label: '쇼핑', id: '1005' },
  { src: Tour, label: '투어', id: '1006' },
  { src: Transportation, label: '교통', id: '1007' },
];

interface SearchThemePanelProps {
  onThemeSelect: (themeId: string) => void;
}

export default function SearchThemePanel({ onThemeSelect }: SearchThemePanelProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const drawerWidth = 320;

  return (
    <div className='SearchThemeContainer'>
      {!isOpen && (
        <Button
          onClick={onOpen}
          style={{
            position: 'fixed',
            top: '60px',
            left: '0px',
            backgroundColor: '#3182ce',
            color: '#fff',
            padding: '8px',
            zIndex: 1500,
            whiteSpace: 'pre-line',
            textAlign: 'center',
          }}
        >
          열<br />기
        </Button>
      )}

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="md">
        <DrawerOverlay zIndex={1400} />

        <DrawerContent width={`${drawerWidth}px`} position="relative">
          <DrawerCloseButton onClick={onClose} />
          <DrawerHeader>테마 선택</DrawerHeader>

          <DrawerBody>
            <Text mb={4} textAlign="center">테마를 선택하세요.</Text>
            <SimpleGrid columns={2} spacing={4} justifyItems="center">
              {imageSources.map((item, index) => (
                <Box key={index} textAlign="center" onClick={() => { onThemeSelect(item.id); onClose(); }}>
                  <Image
                    src={item.src}
                    alt={item.label}
                    boxSize="150px"
                    objectFit="cover"
                    mb={2}
                  />
                  <Text fontSize="sm">{item.label}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>닫기</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

