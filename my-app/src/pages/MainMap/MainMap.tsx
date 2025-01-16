import React, { useState, useEffect } from 'react';
import styles from './MainMap.module.css';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 사용

// Components
import CreateCanvasMap from '../../components/CreateCanvasMap/CreateCanvasMap';
import CreateAudioButton from '../../components/CreateAudioButton/CreateAudioButton';
import AccordionMenu from '../../components/AccordionMenu/AccordionMenu';
import Exp from '../../components/Exp/Exp';
import Coin from '../../components/Coin/Coin';
import { GenerateExpTable } from '../../components/GenerateExpTable/GenerateExpTable';


//Audio
// @ts-ignore
// import OceanSoundForBackground from '../../Audio/LostArkSailingTheDream.mp3';
// import OceanSoundForBackground from '../../Audio/AnotherWorld.mp3';
import OceanSoundForBackground from '../../Audio/SecondRun.mp3';
// import OceanSoundForBackground from '../../Audio/ThirdRun.mp3';
// import OceanSoundForBackground from '../../Audio/Reminiscence.mp3';


// Images
import TalkVillageLogo from '../../image/TalkVillageLogo.png';
import LanguageImage from '../../image/Icons/Language.png'
import LoginImage from '../../image/Icons/Login.png'
import coinImage from '../../image/Ect/coin.png';

const MainMap: React.FC = () => {
  
  // const [userInfo, setUserInfo] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [expInfo, setExpInfo] = useState(0);
  const [toksPoint, setToksPoint] = useState(0);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLogoClick = () => {
    navigate('/mainmap'); // mainmap 경로로 이동
  };

  const baseExp = 100;
  const growthRate = 1.12;
  const maxLevel = 100;

  const expTable = GenerateExpTable(baseExp, growthRate, maxLevel).map(entry => entry.cumulativeExp);

  useEffect(()=> {
    const fetchUserInfo = async ()=> {
      try{
        const response = await fetch('http://localhost:9999/api/user/user',{
          method: 'GET',
          credentials: 'include'
        });
        if(response.ok) {
          const data = await response.json(); 
          // setUserInfo(data);
          setToksPoint(data.point);
          setExpInfo(data.exp);
          // console.log(data);
          // console.log('exp : ' + expInfo);
          // console.log('toksCoin : ' + toksPoint);
          
        } else { // 서버는 갔지만 동작을 못했다 
          setIsLogin(true);
          // ('로그인이 되어있지 않습니다')
        }
      } catch(error) { // 서버에 가지도 못했다 
        setIsLogin(true);
      }
    };
    fetchUserInfo();
  }, []);
  
  return (
    
    <div className={styles.mainMapView}>
      <div className={styles.viewSize}>
        <div className={styles.insideView}>
          <header className={styles.header}>
            <div className={styles.logoBorder}>
              <div>
                <div className={styles.logo} onClick={handleLogoClick}>
                  <CreateCanvasMap imagePath={TalkVillageLogo}  />
                </div>
              </div>
            </div>
            <div className={styles.topSelections}>
              <div className={styles.backgroundSoundButton}><div> <CreateAudioButton audioSrc={OceanSoundForBackground} /></div></div>
              <div className={styles.languageButton}><div><CreateCanvasMap imagePath={LanguageImage} color="rgb(41, 85, 132)"/></div></div>
              <div className={styles.loginButton}><div><CreateCanvasMap imagePath={LoginImage} color="rgb(41, 85, 132)"/></div></div>
            </div>
          </header>

          <div className={styles.body}>
              
            <div className={styles.inside}>
              <div className={styles.insideBox}>
                <div className={styles.mapImageBorder}>
                  <div className={styles.mapImageInside}>
                    <Outlet/>
                    {!isLogin? (
                    <div className={styles.exp}>
                      <Exp currentExp={expInfo} expTable={expTable} segments={10} />
                    </div>
                    ) : (<div></div>)}
                    {!isLogin? (
                      <div className={styles.coin}>
                      <Coin
                        coinImage={coinImage}
                        amount={toksPoint}
                        unit="Toks"
                        width="108px"
                        height="20px"
                        borderRadius="20px"
                        backgroundColor="rgba(200, 200, 255, 0.8)"
                      />
                    </div>
                    ) : (<div></div>)}
                    
                  </div>
                  <div>
                    <div><AccordionMenu /></div>
                    <div className={styles.questionMarkContainer}>
                      <div className={styles.questionMark}>
                        <button>?</button>
                      </div>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
          </div>
          <footer>ⓒ TalkVillage Corp.</footer>

        </div>
      </div>

      </div>
  );
};

export default MainMap;
