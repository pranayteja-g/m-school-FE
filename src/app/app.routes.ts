import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';

export const routes: Routes = [

    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent },
    { path: "forbidden", component: ForbiddenComponent },

    {
        path: "admindashboard",
        component: AdminDashboardComponent,
        canActivate: [authGuard],
        data: { role: 'ROLE_ADMIN' }
    },
    {
        path: "studentdashboard",
        component: StudentDashboardComponent,
        canActivate: [authGuard],
        data: { role: 'ROLE_STUDENT' }
    },
    {
        path: "employeedashboard",
        component: EmployeeDashboardComponent,
        canActivate: [authGuard],
        data: { role: 'ROLE_EMPLOYEE' }
    }

];
