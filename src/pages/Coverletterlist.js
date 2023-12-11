import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Checkbox from '../components/Checkbox';
import Boardlist from '../components/Boardlist';
import axios from 'axios';
import API_BASE_URL from '../Config';

function Coverletterlist() {
  const [educationCheckboxes, setEducationCheckboxes] = useState([]);
  const [experienceCheckboxes, setExperienceCheckboxes] = useState([]);
  const [certificateInput, setCertificateInput] = useState('');

  useEffect(() => {
    // 컴포넌트가 마운트될 때 기존 데이터를 가져오는 GET 요청을 보냅니다.
    axios.get(`${API_BASE_URL}/users/{userid}/extra-info`)
      .then((response) => {
        // 서버에서 받아온 데이터를 해당 state에 업데이트합니다.
        setEducationCheckboxes(response.data.academicBackground || []);
        setExperienceCheckboxes(response.data.experience || []);
      })
      .catch((error) => {
        // 에러 처리
        console.error('Error fetching education and experience data:', error);
      });

    // 자격증 데이터를 가져오는 GET 요청을 보냅니다.
    axios.get(`${API_BASE_URL}/users/{userid}/skill`)
      .then((response) => {
        // 서버에서 받아온 데이터를 자격증 입력 상태에 업데이트합니다.
        setCertificateInput(response.data.skill_name || '');
      })
      .catch((error) => {
        // 에러 처리
        console.error('Error fetching certificate data:', error);
      });
  }, []); // 빈 배열을 넣어 한 번만 실행되도록 합니다.

  const handleSave = async () => {
    // 저장 버튼을 클릭할 때 데이터를 서버로 보내는 POST 요청을 보냅니다.
    await axios.post(`${API_BASE_URL}/users/{userid}/extra-info`, { academicBackground: educationCheckboxes });
    await axios.post(`${API_BASE_URL}/users/{userid}/extra-info`, { experience: experienceCheckboxes });
    await axios.post(`${API_BASE_URL}/users/{userid}/skill`, { skill_name: certificateInput });

    // 성공 메시지나 리디렉션 등을 수행할 수 있습니다.
  };

  return (
    <div>
      <Nav />
      <div className="mr-24 ml-24 mt-10 mb-4">
        <div className="mb-2 pl-4">* 최종학력</div>
        <Checkbox
          checkboxNames={['고등학교 졸업', '전문학사(2년제 전문대학)', '학사(4년제 졸업)', '석사', '박사']}
          selectedCheckboxes={educationCheckboxes}
          onCheckboxChange={setEducationCheckboxes}
        />
      </div>
      <div className="mr-24 ml-24 mb-4">
        <div className="pl-4 pb-2">* 경력</div>
        <Checkbox
          checkboxNames={['1년미만', '1~3년', '3~5년', '5년이상']}
          selectedCheckboxes={experienceCheckboxes}
          onCheckboxChange={setExperienceCheckboxes}
        />
      </div>
      <div className="mr-28 ml-28 pb-4">
        <label className="text-gray-800 block my-3 text-md" htmlFor="certificate">* 자격증</label>
        <input
          className="w-1/2 bg-gray-100 px-2 py-1 rounded-lg focus:outline-none"
          type="text"
          name="certificate"
          id="certificate"
          placeholder="ex)한국사 1급, 컴퓨터활용능력 2급, SQLD, ..."
          value={certificateInput}
          onChange={(e) => setCertificateInput(e.target.value)}
        />
      </div>
      <div className="text-center pt-6">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
      <div className="mt-24">
        <Boardlist />
      </div>
      <Footer />
    </div>
  );
}

export default Coverletterlist;