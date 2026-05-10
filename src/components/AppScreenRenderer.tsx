import {HomeScreen} from './HomeScreen';
import {CourierScreen} from './CourierScreen';
import {WaterRechargeScreen} from './WaterRechargeScreen';
import {TakeoutScreen} from './TakeoutScreen';
import {RepairScreen} from './RepairScreen';
import {LostAndFoundScreen} from './LostAndFoundScreen';
import {ClubsScreen} from './ClubsScreen';
import {NavigationScreen} from './NavigationScreen';
import {ElectricityScreen} from './ElectricityScreen';
import {WalletScreen} from './WalletScreen';
import {CourierCompareScreen} from './CourierCompareScreen';
import {CanteenScreen} from './CanteenScreen';
import {JobsScreen} from './JobsScreen';
import {ServiceCenterScreen} from './ServiceCenterScreen';
import {ProfileScreen} from './ProfileScreen';
import {MyTakeoutOrdersScreen} from './MyTakeoutOrdersScreen';
import {MyRepairRequestsScreen} from './MyRepairRequestsScreen';
import {MyPostsScreen} from './MyPostsScreen';
import {TeacherHomeScreen} from './teacher/TeacherHomeScreen';
import {TeacherCourierScreen} from './teacher/TeacherCourierScreen';
import {TeacherTakeoutScreen} from './teacher/TeacherTakeoutScreen';
import {TeacherMeetingScreen} from './teacher/TeacherMeetingScreen';
import {TeacherDocumentScreen} from './teacher/TeacherDocumentScreen';
import {TeacherStudentAffairsScreen} from './teacher/TeacherStudentAffairsScreen';
import {TeacherRepairScreen} from './teacher/TeacherRepairScreen';
import {TeacherStudyRoomScreen} from './teacher/TeacherStudyRoomScreen';
import {TeacherLeaveScreen} from './teacher/TeacherLeaveScreen';
import {TeacherSalaryScreen} from './teacher/TeacherSalaryScreen';
import {TeacherCampusCardScreen} from './teacher/TeacherCampusCardScreen';
import {TeacherMessageScreen} from './teacher/TeacherMessageScreen';
import {TeacherProfileScreen} from './teacher/TeacherProfileScreen';
import {TeacherOfficeScreen} from './teacher/TeacherOfficeScreen';
import type {Screen} from '../lib/routes';
import type {AuthSession, CourierData, HomeBootstrap, Identity, WalletData} from '../lib/types';

interface AppScreenRendererProps {
  currentScreen: Screen;
  identity: Identity | null;
  session: AuthSession;
  homeData: HomeBootstrap;
  courierData: CourierData;
  walletData: WalletData;
  dataLoading: boolean;
  dataNotice: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export function AppScreenRenderer({
  currentScreen,
  identity,
  session,
  homeData,
  courierData,
  walletData,
  dataLoading,
  dataNotice,
  onNavigate,
  onLogout,
}: AppScreenRendererProps) {
  switch (currentScreen) {
    case 'home':
      return identity === 'teacher'
        ? (
          <TeacherHomeScreen
            onNavigate={onNavigate}
            announcementLabel={homeData.announcement.label}
            announcementMessage={homeData.announcement.message}
            user={session.user}
            wallet={walletData}
            courier={courierData}
            dataNotice=""
          />
        )
        : (
          <HomeScreen
            onNavigate={onNavigate}
            bootstrap={homeData}
            user={session.user}
            wallet={walletData}
            courier={courierData}
            dataNotice=""
          />
        );
    case 'map':
      return <NavigationScreen session={session} />;
    case 'services':
      return identity === 'teacher'
        ? <TeacherOfficeScreen onNavigate={onNavigate} session={session} />
        : <ServiceCenterScreen onNavigate={onNavigate} session={session} />;
    case 'profile':
    case 'teacher-profile':
      return identity === 'teacher'
        ? (
          <TeacherProfileScreen
            onNavigate={onNavigate}
            user={session.user}
            wallet={walletData}
            courier={courierData}
            source={session.source}
            expiresAt={session.expiresAt}
            dataNotice=""
            onLogout={onLogout}
          />
        )
        : (
          <ProfileScreen
            onNavigate={onNavigate}
            user={session.user}
            wallet={walletData}
            courier={courierData}
            source={session.source}
            expiresAt={session.expiresAt}
            dataNotice=""
            onLogout={onLogout}
          />
        );
    case 'courier':
      return <CourierScreen data={courierData} />;
    case 'takeout':
      return <TakeoutScreen session={session} />;
    case 'repair':
      return <RepairScreen session={session} />;
    case 'lost-found':
      return <LostAndFoundScreen session={session} />;
    case 'clubs':
      return <ClubsScreen />;
    case 'water':
      return <WaterRechargeScreen session={session} />;
    case 'electricity':
      return <ElectricityScreen session={session} />;
    case 'wallet':
      return <WalletScreen data={walletData} session={session} />;
    case 'courier-compare':
      return <CourierCompareScreen session={session} />;
    case 'canteen':
      return <CanteenScreen />;
    case 'jobs':
      return <JobsScreen />;
    case 'my-orders':
      return <MyTakeoutOrdersScreen session={session} />;
    case 'my-repairs':
      return <MyRepairRequestsScreen session={session} />;
    case 'my-posts':
      return <MyPostsScreen session={session} />;
    case 'teacher-courier':
      return <TeacherCourierScreen session={session} />;
    case 'teacher-takeout':
      return <TeacherTakeoutScreen session={session} />;
    case 'teacher-meeting':
      return <TeacherMeetingScreen session={session} />;
    case 'teacher-document':
      return <TeacherDocumentScreen session={session} />;
    case 'teacher-student-affairs':
      return <TeacherStudentAffairsScreen session={session} />;
    case 'teacher-repair':
      return <TeacherRepairScreen session={session} />;
    case 'teacher-study-room':
      return <TeacherStudyRoomScreen session={session} />;
    case 'teacher-leave':
      return <TeacherLeaveScreen session={session} />;
    case 'teacher-salary':
      return <TeacherSalaryScreen session={session} />;
    case 'teacher-campus-card':
      return <TeacherCampusCardScreen session={session} />;
    case 'teacher-message':
      return <TeacherMessageScreen />;
    case 'teacher-office':
      return <TeacherOfficeScreen onNavigate={onNavigate} session={session} />;
    case 'splash':
    case 'identity':
    case 'admin-dashboard':
      return null;
    default:
      return assertNever(currentScreen);
  }
}

function assertNever(screen: never): never {
  throw new Error(`Unhandled screen: ${screen}`);
}
