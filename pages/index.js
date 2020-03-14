import React from 'react';
import axios from 'axios';
import ProgressBar from '@atlaskit/progress-bar';
import Button, { ButtonGroup } from '@atlaskit/button';
import Head from 'next/head';
import DropZone from '../components/drop-zone';

import config from '../config/config';

const documentationLink = 'https://documenter.getpostman.com/view/10646880/SzRxUprP?version=latest';
const barelyHumanLink = 'https://barelyhuman.dev';

const defaultModeColors = {
  primaryColor: '#151328',
  pageForeground: '#999999',
  pageBackground: '#ffffff',
};

const darkModeColors = {
  primaryColor: '#eeeeee',
  pageForeground: '#333333',
  pageBackground: '#111111',
};

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.uploadFileOnDrop = this.uploadFileOnDrop.bind(this);
    this.openImageTemplate = this.openImage.bind(this);
    this.getPercentage = this.getPercentage.bind(this);
    this.toggleDarkMode = this.toggleDarkMode.bind(this);
    this.state = {
      currentFileList: [],
      uploadProgress: {},
      fileKeys: {},
      colors: defaultModeColors,
      colorState: 'light',
    };
  }

  getPercentage(item) {
    const { uploadProgress } = this.state;
    if (uploadProgress[item]) {
      const percentage = Math.round(uploadProgress[item] * 100);
      return percentage;
    }
    return 0;
  }

  toggleDarkMode() {
    const { colorState } = this.state;
    if (colorState === 'light') {
      this.setState({
        colorState: 'dark',
        colors: darkModeColors,
      });
    } else {
      this.setState({
        colorState: 'light',
        colors: defaultModeColors,
      });
    }
  }

  openImage(identifier) {
    const { fileKeys } = this.state;
    if (fileKeys[identifier]) {
      const url = `${config.APIURL}/files/get/${fileKeys[identifier]}`;
      window.open(url, '_blank');
    }
  }


  uploadFileOnDrop(e) {
    this.setState({ currentFileList: e });
    e.forEach((fileToUpload) => {
      const fd = new FormData();
      const uploadFileKey = fileToUpload.name;
      fd.append('file', fileToUpload);
      axios.post(`${config.APIURL}/files/upload?expiry=30 secs`,
        fd,
        {
          onUploadProgress: (progressEvent) => {
            const { uploadProgress } = this.state;
            const percentage = (progressEvent.loaded / progressEvent.total).toFixed(2);
            const newUploadProgress = { ...uploadProgress, [uploadFileKey]: percentage };
            this.setState({ uploadProgress: newUploadProgress });
          },
        })
        .then((data) => {
          const { fileKeys } = this.state;
          this.setState({ fileKeys: { ...fileKeys, [uploadFileKey]: data.data.accessKey } });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  render() {
    const {
      colors, fileKeys, currentFileList, uploadProgress,
    } = this.state;
    return (
      <main className="main-container">
        <Head>
          <title>
            TempX | Temporary File Storage
          </title>
          <link href="https://unpkg.com/normalize.css@8.0.1/normalize.css" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Abel&family=Ubuntu&display=swap" rel="stylesheet" />
          <link href="https://css.gg/check.css" rel="stylesheet" />
          <link href="https://css.gg/moon.css" rel="stylesheet" />
        </Head>
        <nav className="flex just-space-between align-baseline flex-wrap">
          <div className="margin-x-2 margin-y-2">
            <a className="animated-underline title" href="/">
              TempX |
              {' '}
              <span>
                <small>
                  Temporary File Storage
                </small>
              </span>
            </a>
          </div>
          <div className="margin-x-2 margin-y-2 flex align-center">
            <button type="button" className="margin-x-2 link-button" onClick={this.toggleDarkMode}>
              <i className="gg-moon dark-mode-button" />
            </button>
            <a className="animated-underline" href={documentationLink}>
              API Documentation
            </a>
          </div>
        </nav>
        <section>

          {
              !currentFileList.length
                ? <DropZone dropAction={this.uploadFileOnDrop} />
                : null
            }
          {
              currentFileList.length
                ? (
                  <div className="file-list-container width-100">
                    <ul className="file-list-wrapper">
                      {currentFileList.map((item) => (
                        <li key={item.name}>
                          <div className="">
                            <div className="margin-x-1 margin-y-1 file-name">
                              {
                                fileKeys[item.name]
                                  ? (
                                    <div className="flex align-center">
                                      <button type="button" className="link-button animated-underline" onClick={() => this.openImage(item.name)}>{item.name}</button>
                                      <span className="completed">
                                        <i className="gg-check" />
                                      </span>
                                    </div>
                                  )
                                  : item.name
                              }
                            </div>
                            <div className="margin-x-1 margin-y-1 width-100 progressbar-wrapper">
                              <ProgressBar value={uploadProgress[item.name]} />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Button className="block margin-x-auto flat-button" onClick={() => this.setState({ currentFileList: [] })}>
                      Upload More
                    </Button>
                  </div>
                )
                : null
            }
        </section>
        <footer className="sticky-footer">
          <p>
            Made at
            {' '}
            <a className="animated-underline" target="_blank" rel="noopener noreferrer" href={barelyHumanLink}>BarelyHuman</a>
          </p>
        </footer>
        <style jsx global>
          {`

          :root{
              --primary-color:${colors.primaryColor};
              --secondary-color:#888888;
              --margin-small:3px;
              --margin-medium:5px;
              --margin-large:10px;
              --success-color:#57c542;
              --page-background:${colors.pageBackground};
              --page-foreground:${colors.pageForeground};
            }

            body{
              font-family:'Ubuntu', sans-serif;
              color:var(--secondary-color);
              background:var(--page-background);
            }

            .block{
              display:block !important;
            }
            
            .flex{
              display:flex !important;
            }

            .flex-wrap{
              flex-wrap:wrap;
            }

            .just-space-between{
              justify-content:space-between;
            }

            .just-center{
              justify-content:center;
            }

            .align-center{
              align-items:center;
            }

            .align-baseline{
              align-items:baseline;
            }


            nav{
              color:var(--primary-color);
              font-family:'Abel', sans-serif;
            }

            .title{
              font-weight:bold;
              font-size:18px;
            }

            a{
              text-decoration:none;
              color:var(--primary-color);
              position:relative;
            }

            .animated-underline{
              position:relative;
            }

            .animated-underline::after{
              content:'';
              position:absolute;
              background:var(--primary-color);
              bottom:0;
              left:0;
              width:100%;
              height:1px;
              transform:scaleX(0);
              transition:transform 250ms;
            }

            .animated-underline:hover::after{
              transform:scaleX(1);
            }


            .main-container{
              padding:20px;
              box-sizing:border-box;
              position:relative;
              min-height:100vh;
            }

            .main-container section{
              display:flex;
              min-height:calc(100vh - 6.5rem);
              justify-content:center;
              align-items:center;
              padding-bottom:2.5rem;
            }


            .main-container footer{
              height:2.5rem;
              bottom:0;
              left:0;
              position:absolute;
              width:100%;
              text-align:center;
            }

            .margin-y-1{
              margin-top:var(--margin-small);
              margin-bottom:var(--margin-small);
            }

            .margin-y-2{
              margin-top:var(--margin-medium);
              margin-bottom:var(--margin-medium);
            }

            .margin-x-1{
              margin-left:var(--margin-medium);
              margin-right:var(--margin-medium);
            }

            .margin-x-2{
              margin-left:var(--margin-medium);
              margin-right:var(--margin-medium);
            }

            .margin-x-auto{
              margin-left:auto;
              margin-right:auto;
            }

            .file-list-wrapper{
              list-style-type:none;
            }

            .file-list-wrapper li{
              min-height:50px;
            }

            button.link-button{
              border:0px;
              outline:none;
              cursor:pointer;
              background:transparent;
              color:var(--primary-color);
            }

            .completed{
              color:var(--success-color)
            }

            .progressbar-wrapper div[role=progressbar] span{
              background:var(--primary-color);
            }

            .flat-button{
              color:${colors.primaryColor} !important;
            }

            .dark-mode-button.gg-moon::after{
              box-shadow: 0px 0px 0px 10px !important;
            }

          `}
        </style>

      </main>
    );
  }
}
