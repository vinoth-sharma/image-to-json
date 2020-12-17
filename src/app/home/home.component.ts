import { Component, OnInit } from '@angular/core';
import Jimp from 'jimp';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = 'image-to-json';
  supportedFormat = ['png', 'jpg', 'jpeg', 'bmp', 'webp'];
  isExtracting: boolean = false;
  imagePath: any;
  imgURL: any;

  // enableUploadBtn: boolean = false;
  selected = {
    file: null,
    file_extension: '',
    height: null,
    width: null,
  };

  constructor(private _snackBar: MatSnackBar) {}

  imagePixelsArr = [];

  ngOnInit() {}

  uploadFile(event) {
    this.isExtracting = true;
    this.imagePixelsArr = [];
    this.selected.file = event[0];
    this.selected.file_extension = event[0].name.split('.').pop();
    this.validateForm();
  }

  validateForm() {
    //image format validation
    if (
      !this.supportedFormat.includes(
        this.selected.file_extension.toLocaleLowerCase()
      )
    ) {
      this.selected = {
        file: null,
        file_extension: '',
        height: null,
        width: null,
      };
      this.imgURL = null;
      this.isExtracting = false;
      this._snackBar.open('Please upload valid image format !!!', '', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
      return;
    }
    console.log('--');

    if (this.selected.file_extension) {
      var reader = new FileReader();
      reader.readAsDataURL(this.selected.file);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
        Jimp.read(this.imgURL).then((image) => {
          this.selected.height = image.bitmap.height;
          this.selected.width = image.bitmap.width;
          this.getPixelsData(this.imgURL);
        });
      };
    }
  }

  getPixelsData(image) {
    this.imagePixelsArr = [];
    Jimp.read(image)
      .then((image) => {
        let orientation = imageOrientation(
          image.bitmap.width,
          image.bitmap.height
        );
        let l_width = 0;
        let l_height = 0;
        if (image.bitmap.width <= 600 && image.bitmap.height <= 600) {
          l_width = image.bitmap.width;
          l_height = image.bitmap.height;
        } else {
          switch (orientation) {
            case 'l':
              l_width = 600;
              l_height = 400;
              break;
            case 'p':
              l_width = 400;
              l_height = 600;
              break;
            case 'n':
              l_width = 600;
              l_height = 600;
              break;

            default:
              break;
          }
        }

        image
          .resize(l_width, l_height)
          .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
            if (x === 0 && y === 0) {
              this.imagePixelsArr.length = image.bitmap.height;
              this.imagePixelsArr.fill([]);
            }
            // x, y is the position of this pixel on the image
            // idx is the position start position of this rgba tuple in the bitmap Buffer
            // this is the image

            var red = image.bitmap.data[idx + 0];
            var green = image.bitmap.data[idx + 1];
            var blue = image.bitmap.data[idx + 2];
            var alpha = image.bitmap.data[idx + 3];
            let l_rgba = `rgba(${red},${green},${blue},${alpha})`;
            // console.log(x, y, l_rgba);
            this.imagePixelsArr[y] = [...this.imagePixelsArr[y], l_rgba];

            // rgba values run from 0 - 255
            // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel

            if (x == image.bitmap.width - 1 && y == image.bitmap.height - 1) {
              // image scan finished, do your stuff
              // console.log(this.imagePixelsArr);
            }
          });
        this.isExtracting = false;
        // Do stuff with the image.
      })
      .catch((err) => {
        // Handle an exception.
      });
  }

  downloadJson() {
    var dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(this.imagePixelsArr));
    var dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'image.json');
    dlAnchorElem.click();
  }
}

//orientation predictor
function imageOrientation(w, h) {
  if (w > h) {
    let max = h * 1.25;
    if (w <= max) return 'n';
    return 'l';
  } else if (w < h) {
    let max = w * 1.25;
    if (h <= max) return 'n';
    return 'p';
  } else if (w === h) {
    return 'n';
  }
}
