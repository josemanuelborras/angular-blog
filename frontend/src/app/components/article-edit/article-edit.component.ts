import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import swal from 'sweetalert';
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';
import { Global } from '../../services/global';

@Component({
  selector: 'app-article-edit',
  templateUrl: '../article-new/article-new.component.html',
  styleUrls: ['./article-edit.component.css'],
  providers: [ArticleService]
})
export class ArticleEditComponent implements OnInit {

  public article: Article;	
  public status: string;
  public is_edit: boolean;
  public page_title: string;
  public url: string;

  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg, .png, .gif, .jpeg",
    maxSize: "50",
    uploadAPI:  {
      url: Global.url+'upload-image'
    },
    theme: "attachPin",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: false,
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Sube la Imagen del Artículo',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !'
      }
    };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _articleService: ArticleService
    ) {
  	this.article = new Article('','','', null, null);
  	this.is_edit = true;
  	this.page_title = 'Editar Artículo';
  	this.url = Global.url;
  }

  ngOnInit(): void {
  	this.getArticle();
  }

  onSubmit(){
  	this._articleService.update(this.article._id, this.article).subscribe(
      response => {
        if(response.status == 'success'){
          this.status = 'success';
          this.article = response.article;

          // Alerta
          swal(
            'Artículo editaddo',
            'El artículo se ha editado correctamente',
            'success'
          );

          this._router.navigate(['/blog/articulo', this.article._id]);
        }else{
          this.status = 'error';
        }

      },
      error => {
        console.log(error);
        this.status = 'error';
        // Alerta
        swal(
          'Edición Fallida',
          'El artículo no se ha editado',
          'error'
        );
      }
    );
  }

  imageUpload(data){
    this.article.image = data.body.image
  }

  getArticle(){
  	this._route.params.subscribe(params =>{
  		let id = params['id'];

  		this._articleService.getArticle(id).subscribe(
  			response => {
  				// console.log(response);
  				if(response.article){
  					this.article = response.article;
  				}else{
  					this._router.navigate(['/home']);
  				}
  			},
  			error => {
  				// console.log(error);
  				this._router.navigate(['/home']);
  			}
  		);

  	});
  }

}
