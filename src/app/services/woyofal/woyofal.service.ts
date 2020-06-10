import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OM_RECENTS_COUNTER_ENDPOINT } from '../utils/om.endpoints';
import { Counter } from 'src/app/models/counter.model';

@Injectable({
  providedIn: 'root'
})
export class WoyofalService {

  constructor(private http:HttpClient) { }

  fetchRecentsCounters(){
    return this.http.get<Counter[]>(OM_RECENTS_COUNTER_ENDPOINT);
  }
}
