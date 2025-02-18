import React from 'react';
import styles from './App.module.css';
import HomePage from './pages/Home/Home';
import LoginPage from './pages/LoginPage/LoginPage';
import SingupPage from './pages/SignupPage/SignupPage';
import FindIdAndPW from './pages/FindIDandPW/FindIdAndPW';
import ProfileSetting from './pages/ProfileSettings/ProfileSettings';
import HangmanGame from './pages/HangmanGame/Hangman';
import WordScrambleGame from './pages/WordScrambleGame/WordScrambleGame';
import Admin from './pages/Admin/Admin';
import Test from './components/StagePanel/StagePanel'
import CrossWord from './pages/CrossWord/CrossWord';
import Store from './pages/Store/Store';
import ClipPage from './pages/Clip/ClipPage';
import UserInfoEdit from './pages/Myinfopage/Myinfo';
import Inventory from './pages/Inventory/Inventory';

// Placement
import MainMap from './pages/MainMap/MainMap';
import MainMapPlacement from './components/MainMapPlacement/MainMapPlacement';
import BeginnerStudyMapPlacement from './components/BeginnerStudyMapPlacement/BeginnerStudyMapPlacement';
import IntermediateStudyMapPlacement from './components/IntermediateStudyMapPlacement/IntermediateStudyMapPlacement';
import AdvancedStudyMapPlacement from './components/AdvancedStudyMapPlacement/AdvancedStudyMapPlacement';
import BBSPlacement from './components/BBSPlacement/BBSPlacement';


import { MainMapProvider } from './components/MainMapProvider/MainMapProvider'; // MainMapContext 임포트

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import ProblemPage from './pages/ProblemPage/ProblemPage';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

//import HomePage from './pages/Home/Home';
import ThemeStudyChapter from './pages/ThemeStudyChapter/ThemeStudyChapter';
import WordAndImagePanel from './components/ThemePanel/WordAndImagePanel/WordAndImage';
import QuestionManager from './components/ThemePanel/QuesionManager/QuestionManager';
import FileUploadAndView from './components/ThemePanel/QuesionManager/FileUploadAndView';
import Dictionary from './pages/Dictionary/Dictionary';
import Translation from './pages/Dictionary/Translation';
import Result from './pages/Dictionary/Result';
import Apitest from './pages/Home/ApiTest';
import VocabularyPage from './pages/VocabularyPage/VocabularyPage';

function App() {
  // Chakra 테마 커스터마이징
  const theme = extendTheme({
    styles: {
      global: {
        body: {
          background: "none", // 배경색 제거
          lineHeight: "normal", // 기본 line-height로 설정
          fonts: {
            body: "'Arial', sans-serif", // 폰트 변경 (선택 사항)
          },
          fontSizes: {
            md: "14px", // Chakra UI 기본 폰트 크기 수정
          },
        },
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <MainMapProvider>
          <Routes>
            {/* 호성 */}
            <Route path="/" element={<HomePage />} />
            <Route index path="/Login" element={<LoginPage />} />
            <Route path="/Signup" element={<SingupPage />} />
            <Route path="/findIDandPW" element={<FindIdAndPW />} />
            <Route path="/ProfileSettings" element={<ProfileSetting />} />
            <Route path="/test" element={<Test />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/Crossword" element={<CrossWord />} />
            <Route path="/store" element={<Store />} />
            <Route path="/clip" element={<ClipPage />} />

            {/* 의령 */}
            {/* <Route path="/problem" element={<ProblemPage />} /> */}

            <Route path="/mainmap" element={<MainMap />}>
              <Route path="myinfo" element={<UserInfoEdit />} />
              <Route path="hangman" element={<HangmanGame />} />
              <Route path="WordScrambleGame" element={<WordScrambleGame />} />
              <Route path="Crossword" element={<CrossWord />} />
              <Route path="" element={<MainMapPlacement />} />
              <Route path="beginnerStudymap" element={<BeginnerStudyMapPlacement />} />
              <Route path="intermediateStudymap" element={<IntermediateStudyMapPlacement />} />
              <Route path="advancedStudymap" element={<AdvancedStudyMapPlacement />} />
              <Route path="bbs" element={<BBSPlacement />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="store" element={<Store />} />
              <Route path="voca" element={<VocabularyPage />} />
            </Route>

            {/* 용현 */}
            {/* <Route index path="/" element={<HomePage />} /> */}
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/translation" element={<Translation />} />
            <Route path="/result" element={<Result />} />
            <Route path="/tsc" element={<ThemeStudyChapter />} />
            <Route path="/wordtest" element={<WordAndImagePanel />} />
            <Route path="/manager" element={<QuestionManager />} />
            <Route path="/apitest" element={<Apitest />} />
            <Route path="/filemanager" element={<FileUploadAndView />} />


            {/* 404 Not Found 페이지 */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </MainMapProvider>

      </Router>
    </ChakraProvider>
  );
}

export default App;