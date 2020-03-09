import React from 'react';
import axios from 'axios';
import ProgressBar from '@atlaskit/progress-bar';
import Layout from '../components/Layout';
import DropZone from '../components/drop-zone';

import config from '../config/config';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.uploadFileOnDrop = this.uploadFileOnDrop.bind(this);
    this.openImageTemplate = this.openImageTemplate.bind(this);
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

  openImageTemplate(identifier) {
    const { fileKeys } = this.state;
    if (fileKeys[identifier]) {
      return (
        <div>
          <a target="_blank" rel="noopener noreferrer" className="action-link" href={`${config.APIURL}/images/get/${fileKeys[identifier]}`}>Open Image</a>
        </div>
      );
    }
    return '';
  }

  uploadFileOnDrop(e) {
    const { currentFileList, uploadProgress, fileKeys } = this.state;
    const fileList = currentFileList.concat(e);
    this.setState({ currentFileList: fileList });
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
    const { currentFileList, uploadProgress } = this.state;
    return (
      <Layout>
        <div className="width-75">
          <DropZone dropAction={this.uploadFileOnDrop} />
          <div className="">
            <ul>
              {currentFileList.map((item) => (
                <li key={item.name}>
                  <div className="padding-25-px flex align-center just-space-between">
                    <div className="margin-x-1">
                      {item.name}
                      {this.openImageTemplate(item.name)}
                    </div>
                    <div className="margin-x-1 width-100">
                      <ProgressBar value={uploadProgress[item.name]} />
                    </div>
                    <div className="margin-x-1">
                      {this.getPercentage(item.name)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </Layout>
    );
  }
}
