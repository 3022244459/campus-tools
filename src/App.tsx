/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { SplashScreen } from './components/SplashScreen';
import { IdentitySelectionScreen } from './components/IdentitySelectionScreen';
import { HomeScreen } from './components/HomeScreen';
import { CourierScreen } from './components/CourierScreen';
import { WaterRechargeScreen } from './components/WaterRechargeScreen';
import { TakeoutScreen } from './components/TakeoutScreen';
import { RepairScreen } from './components/RepairScreen';
import { LostAndFoundScreen } from './components/LostAndFoundScreen';
import { ClubsScreen } from './components/ClubsScreen';
import { NavigationScreen } from './components/NavigationScreen';
import { ElectricityScreen } from './components/ElectricityScreen';
import { WalletScreen } from './components/WalletScreen';
import { CourierCompareScreen } from './components/CourierCompareScreen';
import { CanteenScreen } from './components/CanteenScreen';
import { JobsScreen } from './components/JobsScreen';
import { ServiceCenterScreen } from './components/ServiceCenterScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { TeacherHomeScreen } from './components/teacher/TeacherHomeScreen';
import { TeacherCourierScreen } from './components/teacher/TeacherCourierScreen';
import { TeacherTakeoutScreen } from './components/teacher/TeacherTakeoutScreen';
import { TeacherMeetingScreen } from './components/teacher/TeacherMeetingScreen';
import { TeacherDocumentScreen } from './components/teacher/TeacherDocumentScreen';
import { TeacherStudentAffairsScreen } from './components/teacher/TeacherStudentAffairsScreen';
import { TeacherRepairScreen } from './components/teacher/TeacherRepairScreen';
import { TeacherStudyRoomScreen } from './components/teacher/TeacherStudyRoomScreen';
import { TeacherLeaveScreen } from './components/teacher/TeacherLeaveScreen';
import { TeacherSalaryScreen } from './components/teacher/TeacherSalaryScreen';
import { TeacherCampusCardScreen } from './components/teacher/TeacherCampusCardScreen';
import { TeacherMessageScreen } from './components/teacher/TeacherMessageScreen';
import { TeacherOfficeScreen } from './components/teacher/TeacherOfficeScreen';
import { TeacherProfileScreen } from './components/teacher/TeacherProfileScreen';

type Screen = 
  | 'splash' 
  | 'identity' 
  | 'home' 
  | 'map' 
  | 'services' 
  | 'profile' 
  | 'courier' 
  | 'takeout' 
  | 'repair' 
  | 'lost-found' 
  | 'clubs' 
  | 'water' 
  | 'electricity' 
  | 'wallet' 
  | 'courier-compare' 
  | 'canteen' 
  | 'jobs'
  | 'teacher-courier'
  | 'teacher-takeout'
  | 'teacher-meeting'
  | 'teacher-document'
  | 'teacher-student-affairs'
  | 'teacher-repair'
  | 'teacher-study-room'
  | 'teacher-leave'
  | 'teacher-salary'
  | 'teacher-campus-card'
  | 'teacher-message'
  | 'teacher-office'
  | 'teacher-profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [identity, setIdentity] = useState<'student' | 'teacher' | null>(null);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    // Basic back logic
    const subScreens = [
      'courier', 'takeout', 'repair', 'lost-found', 'clubs', 'water', 'electricity', 'wallet', 'courier-compare', 'canteen', 'jobs',
      'teacher-courier', 'teacher-takeout', 'teacher-meeting', 'teacher-document', 'teacher-student-affairs', 'teacher-repair', 'teacher-study-room', 'teacher-leave', 'teacher-salary', 'teacher-campus-card'
    ];
    if (subScreens.includes(currentScreen)) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('home');
    }
  };

  if (currentScreen === 'splash') {
    return <SplashScreen onComplete={() => setCurrentScreen('identity')} />;
  }

  if (currentScreen === 'identity') {
    return (
      <IdentitySelectionScreen 
        onSelect={(id) => {
          setIdentity(id);
          setCurrentScreen('home');
        }} 
      />
    );
  }

  const getTitle = () => {
    switch (currentScreen) {
      case 'home': return '校园宝';
      case 'map': return '校园导航';
      case 'services': return '服务中心';
      case 'profile': return '个人中心';
      case 'courier': return '取快递';
      case 'takeout': return '外卖代取';
      case 'repair': return '校园报修';
      case 'lost-found': return '失物招领';
      case 'clubs': return '社团资讯';
      case 'water': return '热水充值';
      case 'electricity': return '电费查询';
      case 'wallet': return '校园卡充值';
      case 'courier-compare': return '快递比价';
      case 'canteen': return '食堂优惠';
      case 'jobs': return '兼职信息';
      case 'teacher-courier': return '快递代取';
      case 'teacher-takeout': return '外卖代取';
      case 'teacher-meeting': return '会议室预约';
      case 'teacher-document': return '文件代送';
      case 'teacher-student-affairs': return '学生事务';
      case 'teacher-repair': return '校园报修';
      case 'teacher-study-room': return '研讨室管理';
      case 'teacher-leave': return '请假审批';
      case 'teacher-salary': return '工资查询';
      case 'teacher-campus-card': return '校园卡';
      case 'teacher-message': return '消息';
      case 'teacher-office': return '办公中心';
      case 'teacher-profile': return '个人中心';
      default: return '校园宝';
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': 
        return identity === 'teacher' 
          ? <TeacherHomeScreen onNavigate={handleNavigate} /> 
          : <HomeScreen onNavigate={handleNavigate} />;
      case 'map': return <NavigationScreen />;
      case 'services': 
        return identity === 'teacher'
          ? <TeacherOfficeScreen onNavigate={handleNavigate} />
          : <ServiceCenterScreen onNavigate={handleNavigate} />;
      case 'profile': 
        return identity === 'teacher'
          ? <TeacherProfileScreen />
          : <ProfileScreen onNavigate={handleNavigate} />;
      case 'courier': return <CourierScreen />;
      case 'takeout': return <TakeoutScreen />;
      case 'repair': return <RepairScreen />;
      case 'lost-found': return <LostAndFoundScreen />;
      case 'clubs': return <ClubsScreen />;
      case 'water': return <WaterRechargeScreen />;
      case 'electricity': return <ElectricityScreen />;
      case 'wallet': return <WalletScreen />;
      case 'courier-compare': return <CourierCompareScreen />;
      case 'canteen': return <CanteenScreen />;
      case 'jobs': return <JobsScreen />;
      case 'teacher-courier': return <TeacherCourierScreen />;
      case 'teacher-takeout': return <TeacherTakeoutScreen />;
      case 'teacher-meeting': return <TeacherMeetingScreen />;
      case 'teacher-document': return <TeacherDocumentScreen />;
      case 'teacher-student-affairs': return <TeacherStudentAffairsScreen />;
      case 'teacher-repair': return <TeacherRepairScreen />;
      case 'teacher-study-room': return <TeacherStudyRoomScreen />;
      case 'teacher-leave': return <TeacherLeaveScreen />;
      case 'teacher-salary': return <TeacherSalaryScreen />;
      case 'teacher-campus-card': return <TeacherCampusCardScreen />;
      default: return identity === 'teacher' 
        ? <TeacherHomeScreen onNavigate={handleNavigate} /> 
        : <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  const activeTab = ['home', 'map', 'services', 'profile'].includes(currentScreen) ? currentScreen : 'home';

  return (
    <Layout 
      title={getTitle()} 
      activeTab={activeTab} 
      setActiveTab={handleNavigate}
      onBack={handleBack}
      showBack={!['home', 'map', 'services', 'profile'].includes(currentScreen)}
      identity={identity}
    >
      {renderScreen()}
    </Layout>
  );
}

