import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { Post } from './post.model';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/posts';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[] , postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    console.log(BACKEND_URL + queryParams);
    this.http.get<{message: string, posts: any, maxPost: number  }>( BACKEND_URL + queryParams)
    .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator:  post.creator
          };
        }),
        maxPost: postData.maxPost
    };
  }))
    .subscribe( transformedPosts => {
      this.posts = transformedPosts.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPosts.maxPost
      });
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title );
    console.log(postData.get('image'));
    this.http
    .post<{message: string, post: Post}>(
      BACKEND_URL,
      postData)
    .subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title );
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put( BACKEND_URL + '/' + id, postData)
    .subscribe( respone => {
      this.router.navigate(['/']);
    });
  }

  getPost(id: string) {
    return this.http.get<
    {
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>(  BACKEND_URL + '/' + id);

  }
  deletePost(postId: string) {
  return  this.http.delete(BACKEND_URL + '/' +  postId);
  }
}
