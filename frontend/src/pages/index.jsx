import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Projects from './Projects';
import Tasks from './Tasks';

export const LoginPage = Login;
export const SignupPage = Signup;
export const DashboardPage = Dashboard;

export const ProjectsPage = Projects;
export const ProjectDetailsPage = () => <div>Project Details (To be implemented)</div>;
export const TasksPage = Tasks;
export const NotFoundPage = () => <div style={{textAlign: 'center', padding: '40px'}}>404 - Page Not Found</div>;
