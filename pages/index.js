import React from 'react';
import axios from 'axios';
import ProgressBar from '@atlaskit/progress-bar';
import Button, { ButtonGroup } from '@atlaskit/button';

import Layout from '../components/Layout';
import DropZone from '../components/drop-zone';

import config from '../config/config';

const openDocumentation = () => {
  window.open('https://documenter.getpostman.com/view/10646880/SzRxUprP?version=latest', '_blank');
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
    axios.post(`${config.APIURL}/images/upload?expiry=30 secs`,
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
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { fileKeys, currentFileList, uploadProgress } = this.state;
    return (
      <Layout>
        <div className="center-container">

          <div className="top-bar">
            <Button appearance="subtle-link" className="top-bar-item" onClick={() => openDocumentation()}>
              API Documentation
            </Button>
          </div>

          {!currentFileList.length ? (
            <div className="drop-zone-container">
              <DropZone dropAction={this.uploadFileOnDrop} />
            </div>
          ) : null}

          {
            currentFileList.length ? (
              <div className="file-list-container">
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
                                <Button className="margin-y-1 secondary-text" onClick={() => this.openImage(item.name)}>
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
        <style jsx>
          {`

                .center-container{
                  width:300px;
                  height:400px;
                  box-sizing:border-box;
                  position:absolute;
                  top:50%;
                  left:50%;
                  transform:translate(-50%,-50%);
                  background:#fff;
                  border-radius: 15px;
                  box-shadow:  30px 30px 60px rgba(0,0,0,0.12), 
                    -30px -30px 60px rgba(0,0,0,0.12);
                }

                .drop-zone-container{
                  position:relative;
                  top:50%;
                  transform:translateY(-50%);
                }

                .file-name{
                  max-width: 171px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  display: block;
                  color:#595EF2;
                }

                .file-list-container{
                  position:relative;
                  top:50%;
                  transform:translateY(-50%);
                }

                .top-bar{
                  position: absolute;
                  top: 15px;
                  font-size: 12px;
                  text-align: center;
                  width: 100%;
                  color:#A1AAD0;
                }

                .top-bar .top-bar-item:hover{
                  color:#595EF2;
                }

                .top-bar .top-bar-item{
                  cursor:pointer;
                }


                `}
        </style>

      </Layout>
    );
  }
}
