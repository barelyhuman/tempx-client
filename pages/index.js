import React from 'react';
import axios from 'axios';
import ProgressBar from '@atlaskit/progress-bar';
import Button, { ButtonGroup } from '@atlaskit/button';
import Head from 'next/head';

import Layout from '../components/Layout';
import DropZone from '../components/drop-zone';

import config from '../config/config';

const openDocumentation = () => {
  window.open('https://documenter.getpostman.com/view/10646880/SzRxUprP?version=latest', '_blank');
  return false;
};

const openBarelyHuman = () => {
  window.open('https://barelyhuman.dev', '_blank');
  return false;
};

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.uploadFileOnDrop = this.uploadFileOnDrop.bind(this);
    this.openImageTemplate = this.openImage.bind(this);
    this.getPercentage = this.getPercentage.bind(this);
    this.state = {
      currentFileList: [],
      uploadProgress: {},
      fileKeys: {},
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

  openImage(identifier) {
    const { fileKeys } = this.state;
    if (fileKeys[identifier]) {
      const url = `${config.APIURL}/images/get/${fileKeys[identifier]}`;
      window.open(url, '_blank');
    }
  }


  uploadFileOnDrop(e) {
    const { uploadProgress, fileKeys } = this.state;
    this.setState({ currentFileList: e });
    const fd = new FormData();
    const fileToUpload = e[0];
    fd.append('file', fileToUpload);
    axios.post(`${config.APIURL}/images/upload?expiry=10m`,
      fd,
      {
        onUploadProgress: (progressEvent) => {
          const percentage = (progressEvent.loaded / progressEvent.total).toFixed(2);
          const newUploadProgress = { ...uploadProgress, [fileToUpload.name]: percentage };
          this.setState({ uploadProgress: newUploadProgress });
        },
      })
      .then((data) => {
        this.setState({ fileKeys: { ...fileKeys, [fileToUpload.name]: data.data.accessKey } });
      })
      .catch(() => {});
  }

  render() {
    const { fileKeys, currentFileList, uploadProgress } = this.state;
    return (
      <>
        <Layout>
          <Head>
            <title>TempX - Temporary File Storage</title>
            <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600&display=swap" rel="stylesheet" />
          </Head>
          <div className="flex flex-col width-100 secondary-text-color">
            <h3 className="title-text">
              TempX
              <p>
                <small>
                  Temporary File Storage
                </small>
              </p>
            </h3>

            <div className="top-bar">
              <Button appearance="subtle-link" className="top-bar-item" onClick={() => openDocumentation()}>
                API Documentation
              </Button>
            </div>

            <div className="flex align-center width-100 height-100">
              <div className="center-container height-100 width-100">

                {!currentFileList.length ? (
                  <div className="drop-zone-container height-100 width-100">
                    <DropZone dropAction={this.uploadFileOnDrop} />
                  </div>
                ) : null}

                {
            currentFileList.length ? (
              <div className="file-list-container width-100">
                <ul>
                  {currentFileList.map((item) => (
                    <li key={item.name}>
                      <div className="">
                        <p className="margin-x-1 file-name">{item.name}</p>
                        <div className="margin-x-1 width-100">
                          <ProgressBar value={uploadProgress[item.name]} />
                        </div>
                        <div className="margin-y-2 flex just-center">
                          {fileKeys[item.name]
                            ? (
                              <ButtonGroup appearance="subtle">
                                <Button className="margin-y-1 primary-text" onClick={() => this.openImage(item.name)}>
                                  View
                                </Button>
                                <Button className="margin-y-1 secondary-text" onClick={() => this.setState({ currentFileList: [] })}>
                                  Upload More
                                </Button>
                              </ButtonGroup>
                            ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          }
              </div>
            </div>
          </div>
          <style jsx>
            {`

                .title-text{
                  margin-top:10px;
                  text-align:center;
                }

                .center-container{
                  box-sizing:border-box;
                }

                .drop-zone-container{
                  position:relative;
                  top:40%;
                  transform:translateY(-50%);
                }

                .file-name{
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  display: block;
                  color:#595EF2;
                  margin-bottom:8px;
                }

                .file-list-container{
                  position:relative;
                  top:40%;
                  transform:translateY(-50%);
                }

                .top-bar{
                  font-size: 14px;
                  text-align: center;
                }

                .top-bar .top-bar-item:hover{
                  color:#000 !important;
                }

                .top-bar .top-bar-item{
                  cursor:pointer;
                  color:#333 important;
                }


                `}
          </style>
        </Layout>
        <footer>
          <p className="font-size-12-px">
            <small>
              <Button appearance="subtle-link" className="margin-x-0 padding-x-0 underline" onClick={openBarelyHuman}>by Barely Human</Button>
            </small>
          </p>
          <style jsx>
            {`
                  footer{
                    position:fixed;
                    bottom:0;
                    left:0;
                    right:0;
                    height:41px;
                    text-align:center;
                  }
                `}
          </style>
        </footer>
      </>
    );
  }
}
