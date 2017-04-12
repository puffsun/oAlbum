import axios from 'axios';
import * as _ from 'lodash';
import * as constants from './consts';

let config = require('../config.json');

export default class Argus {
    static request(path, body, uid = '', token = '', method = 'post') {
        return axios({
            method: method,
            url: path,
            baseURL: config.argusEndpoint,
            responseType: 'json',
            timeout: 60000,
            data: body,
            headers: {
                'Authorization': token
            },
            transformResponse: [argusTransformer]
        });
    }
}

function argusTransformer(data) {
    // sample data
    /*
    {
        "code": 200,                                         // 错误代码
        "message": "success",                              // 错误信息
        "nonce": 91232132131,                              // 随机数
        "fileList": [                                      // 检测结果列表
            {
                "name": "90aiui1231wrewrefdsfd",           // 图片的唯一标识
                "face-feature": {                          // 人脸特征
                    // TODO 填我！！！
                },
                "face-cluster": {                          // 人脸聚类
                    "number": 2,                           // 表示人脸个数
                    "detections": [
                        {
                            "score": 0.99,                 // 分数
                            "pts": [                       // 人脸的位置
                                [1,2,3,4],
                                [10,15,18,20]
                            ]
                        }
                    ],
                    "version":"v1",                        // 模型的版本号
                    "cluster": [1,2]                       // 变长的人脸聚类结果
                }
                "scene": {                                 // 场景
                    "tag": ["arena","indoor"],             // 类别，从小到大
                    "top-1": [44,0.5951091647148132],
                    "top-class": "/basketball_co/indoor",  // optinal 细致分类，有大量分类，例如场景360类有此选项
                    "top-5": [                             // optional: 小类特别多超过100类，返回top作为参考
                        [65,0.0007296371622942388],
                        [168,0.0024321076925843954],
                        [310,0.006565876305103302],
                        [351,0.3937026858329773],
                        [44,0.5951091647148132]
                    ],
                    "version":"v1",                         // 模型的版本号
                },
                "pulp": {                                   // 鉴黄
                    "label": 2,                             // 0-黄色，1-性感，2-正常
                    "rate": 0.9851091647148132,
                    "version":"v1",                         // 模型的版本号
                    "review": false                         // optinal 是否需要人工review 内容审核相关tag有该选项
                },
                "detection": {                              // 物体检测
                      "version": "v1",                      // 模型的版本号
                      "detections": [                       // 检测结果
                      {
                        "score": 0.817891538143158,         // 置信度
                        "bbox": [283.836, 167.957, 603.974, 465.585], // 座标 [minx, miny, maxx, maxy]
                        "class": "bicycle\r"                // 类别
                      }, {
                        "score": 0.9139991402626038,        // 置信度
                        "bbox": [470.384, 76.155, 593.401, 153.527],  // 座标 [minx, miny, maxx, maxy]
                        "class": "car\r"                    // 类别
                      }]
                }
            }
        ],
        "timestamp": 2343434333
    }
    */
    //return data;

    let result = {
        "code": 200,                                         // 错误代码
        "message": "success",                              // 错误信息
        "nonce": 91232132131,                              // 随机数
        "fileList": [                                      // 检测结果列表
            {
                "name": "90aiui1231wrewrefdsfd",           // 图片的唯一标识
                "face-feature": {                          // 人脸特征
                    // TODO 填我！！！
                },
                "face-cluster": {                          // 人脸聚类
                    "number": 2,                           // 表示人脸个数
                    "detections": [
                        {
                            "score": 0.99,                 // 分数
                            "pts": [                       // 人脸的位置
                                [1,2,3,4],
                                [10,15,18,20]
                            ]
                        }
                    ],
                    "version":"v1",                        // 模型的版本号
                    "cluster": [1,2]                       // 变长的人脸聚类结果
                },
                "scene": {                                 // 场景
                    "tag": ["arena","indoor"],             // 类别，从小到大
                    "top-1": [44,0.5951091647148132],
                    "top-class": "/basketball_co/indoor",  // optinal 细致分类，有大量分类，例如场景360类有此选项
                    "top-5": [                             // optional: 小类特别多超过100类，返回top作为参考
                        [65,0.0007296371622942388],
                        [168,0.0024321076925843954],
                        [310,0.006565876305103302],
                        [351,0.3937026858329773],
                        [44,0.5951091647148132]
                    ],
                    "version":"v1",                         // 模型的版本号
                },
                "pulp": {                                   // 鉴黄
                    "label": 2,                             // 0-黄色，1-性感，2-正常
                    "rate": 0.9851091647148132,
                    "version":"v1",                         // 模型的版本号
                    "review": false                         // optinal 是否需要人工review 内容审核相关tag有该选项
                },
                "detection": {                              // 物体检测
                      "version": "v1",                      // 模型的版本号
                      "detections": [                       // 检测结果
                      {
                        "score": 0.817891538143158,         // 置信度
                        "bbox": [283.836, 167.957, 603.974, 465.585], // 座标 [minx, miny, maxx, maxy]
                        "class": "bicycle\r"                // 类别
                      }, {
                        "score": 0.9139991402626038,        // 置信度
                        "bbox": [470.384, 76.155, 593.401, 153.527],  // 座标 [minx, miny, maxx, maxy]
                        "class": "car\r"                    // 类别
                      }]
                }
            }
        ],
        "timestamp": 2343434333
    };

    if (result.code && result.code < 400) {
        // successful request with proper payload.
        let imgList = result.fileList;
        return imgList.map(function(img) {
            return {
                name: img.name,
                face_cluster: getFaceCluster(img),
                scene: getScene(img),
                detection: getDetection(img)
            };
        });
    } else {
        // failed request.
        return {
            message: result.message
        };
    }
}

function getFaceCluster(o) {
    if (!_.isPlainObject(o)) {
        return [];
    }
    return o['face-cluster']['cluster'];
}

function getScene(o) {
    if (!_.isPlainObject(o)) {
        return '';
    }

    let tags = o['scene']['tag'];
    if (_.isEmpty(tags)) {
        return '';
    }
    return translate(_.first(tags), 'scene');
}

// translate specified English word to Chinese
function translate(str, type) {
    let result = _.trim(str);
    switch (type) {
        case 'scene':
            result = constants.SCENE_TRANSLATIONS[result] || result;
            break;
        case 'object':
            result = constants.OBJECT_TRANSLATIONS[result] || result;
            break;
        default:
            break;
    }
    return result;
}

function getDetection(o) {
    if (!_.isPlainObject(o)) {
        return [];
    }
    let ds = o['detection']['detections'];
    return ds.map(function(item) {
        return translate(item['class'], 'object');
    });
}
