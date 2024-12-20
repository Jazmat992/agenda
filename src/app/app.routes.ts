import { Routes } from '@angular/router';
import { BucketListComponent } from './pages/bucket-list/bucket-list.component';
import { BucketEditComponent } from './pages/bucket-edit/bucket-edit.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    {path: '', component: BucketListComponent},
    {path: 'bucket-edit/:id', component: BucketEditComponent},
    {path: '**', component: NotFoundComponent}
];
