import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from '../user';

@Component({
  selector: 'app-listar-users',
  templateUrl: './listar-users.component.html',
  styleUrls: ['./listar-users.component.css']
})
export class ListarUserComponent implements OnInit {
  users: any;
  user!: User;
  userForm!: FormGroup;


  errorsMessages: string[] = [];
  edit = false;
  loading = false;;
  success = false;
  error = false;

  displayedColumns: string[] = ['primeiroNome','ultimoNome','email','numeroTelemovel','cargo','opcoes'];

  constructor(private fb: FormBuilder, private userService: UserService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.listarUsers();
  }

  back() {
    this.edit = false;
  }

  listarUsers() {
    this.userService.listarUsers().subscribe((data: User[]) => {
      this.users = new MatTableDataSource(data);
      this.users.paginator = this.paginator;
    });
  }


  cancelarUser(user: string) {
    this.userService.listarUser(user).subscribe(data => {

      this.user = data;
      this.user.primeiroNome = "???";
      this.user.ultimoNome = "???";
      this.user.numeroTelemovel = "???";
      
      this.user.ativo = false;
      this.userService.editarUser(this.user).subscribe((data) => {
        this.user = data;
        this.listarUsers();
      });

    })
  }

  
  get email() {
    return this.userForm.get('email');
  }


  


}