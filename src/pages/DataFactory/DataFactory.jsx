import React from 'react'
import {dataService} from '../../api/data'
import { toast } from 'react-toastify';
import { alpha, KoAddress, TLD, content, thumbnail, type } from './data.js';
const DataFactory = () => {
  function randomNum(min, max) {
    return Math.floor(Math.random()*(max - min + 1)) + min;
  }
  async function generateDummyUser(){
    try {
      const lastIdx = await dataService.getUserLastIndex();
      for (let i = lastIdx; i < lastIdx+30; i++) {
        const user = {
          user_no   : i,
          user_id   : Array.from({length:8} , () => alpha[randomNum(0,alpha.length-1)]).join('')  + i ,
          user_pwd  : Array.from({length:10}, () => alpha[randomNum(0,alpha.length-1)]).join('') + i ,
          user_name : Array.from({length:10}, () => alpha[randomNum(0,alpha.length-1)]).join(''),
          nick_name : Array.from({length:15}, () => alpha[randomNum(0,alpha.length-1)]).join(''),
          email     : Array.from({length:10}, () => alpha[randomNum(0,alpha.length-1)]).join('') + i + 
                      '@' + 
                      Array.from({length:randomNum(5,8)}, () => alpha[randomNum(0,25)]).join('') +
                      '.' +
                      TLD[randomNum(0,TLD.length-1)],
          address   : KoAddress[randomNum(0,KoAddress.length-1)],
          
          create_at : Date.now(),
          update_at : Date.now(),
        };
        await dataService.generateDummyUser(user)
      }
      toast.info("사용자 더미데이터 생성 성공")
    } catch {
      toast.error("사용자 더미데이터 생성 실패")
    }
  }

  async function generateDummyBoard() {
    try {
      const boardLastIdx = await dataService.getBoardLastIndex();
      const userIdxList = await dataService.getUserIndexList();
      for (let i = boardLastIdx; i < boardLastIdx+30; i++) {
        const contentNo = randomNum(0,content.length-1);

        const board = {
          board_no    : i,
          user_no     : userIdxList[randomNum(0, userIdxList.length-1)],
          title       : content[contentNo].title,
          thumbnail   : thumbnail[randomNum(0,thumbnail.length-1)],
          description : content[contentNo].description,
          create_at   : Date.now(),
          update_at   : Date.now(),
        };
        console.log(board)
        await dataService.generateDummyBoard(board);
      }
      toast.info("게시글 더미데이터 생성 성공")
    } catch {
      toast.error("게시글 더미데이터 생성 실패")
    }
  }
  async function generateDummyEvent() {
    console.log("렌더링됨")
    try {
      const EventLastIdx = await dataService.getEventLastIndex();
      const userIdxList  = await dataService.getUserIndexList();
      const boardIdxList = await dataService.getBoardIndexList();
      for (let i = EventLastIdx; i < EventLastIdx+50; i++) {
        const event = {
          event_no    : i,
          user_no     : userIdxList [randomNum(0, userIdxList.length-1)],
          board_no    : boardIdxList[randomNum(0, boardIdxList.length-1)],
          type        : type        [randomNum(0, type.length-1)],
          create_at   : thumbnail   [randomNum(0, thumbnail.length-1)],
        };
        await dataService.generateDummyEvent(event);
      }
      toast.info("이벤트 더미데이터 생성 성공")
    } catch {
      toast.error("이벤트 더미데이터 생성 실패")
    }
  }

  return (
    <div>
      <button type='button' onClick={generateDummyUser}>user 생성</button>
      <button type='button' onClick={generateDummyBoard}>board 생성</button>
      <button type='button' onClick={generateDummyEvent}>event 생성</button>
    </div>
  )
}

export default DataFactory
