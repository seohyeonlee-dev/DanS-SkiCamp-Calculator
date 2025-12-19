import React, { useState } from 'react';
import './App.css';

function App() {
  const [package_type, setPackageType] = useState('accommodation-only');
  const [selections, setSelections] = useState({
    day2_oyakken: false,
    day2_afternoon: false,
    day3_oyakken: false,
    day3_afternoon: false,
    skisuit: false,
    shuttle: false,
    gloves: '0',
    goggles: '0',
    helmet: 'visor'
  });

  const PRICES = {
    accommodation: 84000,
    day2_oyakken: 82000,
    day2_afternoon: 61000,
    day3_oyakken: 82000,
    day3_afternoon: 61000,
    skisuit: 18000,
    shuttle: 20000,
    gloves: { '0': 0, '20000': 20000 },
    goggles: { '0': 0, '30000': 30000 },
    helmet: { 'visor': 30000, 'normal': 10000 }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelections(prev => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setSelections(prev => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (pkg) => {
    setPackageType(pkg);
    // 스키 패키지가 아니면 스키 관련 선택 초기화
    if (pkg === 'accommodation-only') {
      setSelections(prev => ({
        ...prev,
        day2_oyakken: false,
        day2_afternoon: false,
        day3_oyakken: false,
        day3_afternoon: false,
        skisuit: false
      }));
    }
  };

  // 가격 계산 함수
  const calculateTotal = () => {
    let total = PRICES.accommodation;
    let breakdown = {
      accommodation: PRICES.accommodation,
      ski: 0,
      skisuit: 0,
      shuttle: 0,
      gloves: 0,
      goggles: 0,
      helmet: 0
    };

    if (package_type === 'ski-accommodation') {
      // 스키 이용료
      if (selections.day2_oyakken) breakdown.ski += PRICES.day2_oyakken;
      if (selections.day2_afternoon) breakdown.ski += PRICES.day2_afternoon;
      if (selections.day3_oyakken) breakdown.ski += PRICES.day3_oyakken;
      if (selections.day3_afternoon) breakdown.ski += PRICES.day3_afternoon;

      // 스키복
      if (selections.skisuit) breakdown.skisuit = PRICES.skisuit;

      // 액세서리
      breakdown.gloves = PRICES.gloves[selections.gloves];
      breakdown.goggles = PRICES.goggles[selections.goggles];
      breakdown.helmet = PRICES.helmet[selections.helmet];
    } else {
      // 숙박만 선택: 헬멧은 숨김
      breakdown.helmet = 0;
    }

    // 셔틀
    if (selections.shuttle) breakdown.shuttle = PRICES.shuttle;

    // 총합
    total = breakdown.accommodation + breakdown.ski + breakdown.skisuit + 
            breakdown.shuttle + breakdown.gloves + breakdown.goggles + breakdown.helmet;

    return { total, breakdown };
  };

  const { total, breakdown } = calculateTotal();
  const formatCurrency = (amount) => amount.toLocaleString('ko-KR') + '원';

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎿 DanS 7기 스키캠프</h1>
        <p className="subtitle">실시간 가격 계산기</p>
      </header>

      <div className="container">
        {/* 기본 정보 */}
        <div className="card">
          <div className="card-header">
            <h5>📋 기본 정보</h5>
          </div>
          <div className="card-body">
            <div className="info-box">
              📍 <strong>장소:</strong> 모나 용평<br/>
              📅 <strong>일시:</strong> 1월 19일(월) ~ 1월 21일(수) / 2박 3일<br/>
              🏨 <strong>숙소:</strong> 모나 용평 빌라콘도<br/>
              👥 <strong>인원:</strong> 12명 이하
            </div>
            <div className="warning-box">
              ⏰ <strong>입금 기한:</strong> 12월 28일(일)까지<br/>
              계좌 및 금액은 카카오톡 단체 채팅방을 통해 공지될 예정입니다.
            </div>
          </div>
        </div>

        {/* 패키지 선택 */}
        <div className="card">
          <div className="card-header">
            <h5>🎯 패키지 선택</h5>
          </div>
          <div className="card-body">
            <div className="btn-group-primary">
              <button 
                className={`btn-package ${package_type === 'accommodation-only' ? 'active' : ''}`}
                onClick={() => handlePackageChange('accommodation-only')}
              >
                🏨 숙박만
              </button>
              <button 
                className={`btn-package ${package_type === 'ski-accommodation' ? 'active' : ''}`}
                onClick={() => handlePackageChange('ski-accommodation')}
              >
                🎿 스키+숙박
              </button>
            </div>
          </div>
        </div>

        {/* 필수: 숙박비 */}
        <div className="card">
          <div className="card-header">
            <h5>🛌 필수 - 숙박비</h5>
          </div>
          <div className="card-body">
            <div className="form-check">
              <input type="checkbox" id="accommodation" checked disabled />
              <label htmlFor="accommodation">
                <strong>숙박비 (2박)</strong><br/>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>모나 용평 빌라콘도 (12인 기준)</span>
              </label>
              <div className="price-tag">84,000원</div>
            </div>
          </div>
        </div>

        {/* 선택: 스키 이용료 */}
        {package_type === 'ski-accommodation' && (
          <div className="card">
            <div className="card-header">
              <h5>🎫 선택 - 스키장 이용료 (1일당)</h5>
            </div>
            <div className="card-body">
              <p className="optional-note">💡 도착 시간에 따라 1일차 13:30 이후 이용 가능할 수 있습니다.</p>

              <div className="section">
                <div className="section-title">📅 2일차 (1월 20일 화)</div>
                <div className="form-group-ski">
                  <div className="ski-option-card">
                    <div className="ski-option-title">🌙 오야권 (13:00~23:00, 8시간)</div>
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        id="day2_oyakken" 
                        name="day2_oyakken"
                        checked={selections.day2_oyakken}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="day2_oyakken">
                        리프트권 + 장비 렌탈 (57,000 + 25,000)
                      </label>
                      <div className="price-tag">82,000원</div>
                    </div>
                  </div>
                  <div className="ski-option-card">
                    <div className="ski-option-title">☀️ 오후권 (13:00~17:00, 4시간)</div>
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        id="day2_afternoon" 
                        name="day2_afternoon"
                        checked={selections.day2_afternoon}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="day2_afternoon">
                        리프트권 + 장비 렌탈 (40,000 + 21,000)
                      </label>
                      <div className="price-tag">61,000원</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="section">
                <div className="section-title">📅 3일차 (1월 21일 수)</div>
                <div className="form-group-ski">
                  <div className="ski-option-card">
                    <div className="ski-option-title">🌙 오야권 (13:00~23:00, 8시간)</div>
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        id="day3_oyakken" 
                        name="day3_oyakken"
                        checked={selections.day3_oyakken}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="day3_oyakken">
                        리프트권 + 장비 렌탈 (57,000 + 25,000)
                      </label>
                      <div className="price-tag">82,000원</div>
                    </div>
                  </div>
                  <div className="ski-option-card">
                    <div className="ski-option-title">☀️ 오후권 (13:00~17:00, 4시간)</div>
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        id="day3_afternoon" 
                        name="day3_afternoon"
                        checked={selections.day3_afternoon}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="day3_afternoon">
                        리프트권 + 장비 렌탈 (40,000 + 21,000)
                      </label>
                      <div className="price-tag">61,000원</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="section">
                <div className="section-title">👕 스키복 대여 (공통)</div>
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    id="skisuit" 
                    name="skisuit"
                    checked={selections.skisuit}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="skisuit">
                    스키복 대여
                  </label>
                  <div className="price-tag">18,000원</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 선택: 셔틀 */}
        <div className="card">
          <div className="card-header">
            <h5>🚌 선택 - 셔틀 이용료 (왕복)</h5>
          </div>
          <div className="card-body">
            <div className="form-check">
              <input 
                type="checkbox" 
                id="shuttle" 
                name="shuttle"
                checked={selections.shuttle}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="shuttle">
                셔틀 이용 (왕복)
              </label>
              <div className="price-tag">20,000원</div>
            </div>
          </div>
        </div>

        {/* 선택: 액세서리 */}
        {package_type === 'ski-accommodation' && (
          <div className="card">
            <div className="card-header">
              <h5>🧤 선택 - 액세서리</h5>
            </div>
            <div className="card-body">
              <div className="section">
                <div className="section-title">🧤 장갑 / 🥽 고글</div>
                <p className="optional-note">💡 개인 지참 또는 현장 구매 가능합니다.</p>
                
                <div className="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      name="gloves" 
                      value="0"
                      checked={selections.gloves === '0'}
                      onChange={handleRadioChange}
                    />
                    장갑 지참
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="gloves" 
                      value="20000"
                      checked={selections.gloves === '20000'}
                      onChange={handleRadioChange}
                    />
                    현장 구매 (약 20,000원)
                  </label>
                </div>

                <div className="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      name="goggles" 
                      value="0"
                      checked={selections.goggles === '0'}
                      onChange={handleRadioChange}
                    />
                    고글 지참
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="goggles" 
                      value="30000"
                      checked={selections.goggles === '30000'}
                      onChange={handleRadioChange}
                    />
                    현장 구매 (약 30,000원)
                  </label>
                </div>
              </div>

              <div className="section">
                <div className="section-title">⛑️ 헬멧 (필수 - 현장 대여)</div>
                <p className="optional-note">💡 바이저 헬멧의 경우 고글이 불필요합니다.</p>
                
                <div className="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      name="helmet" 
                      value="visor"
                      checked={selections.helmet === 'visor'}
                      onChange={handleRadioChange}
                    />
                    바이저 헬멧
                  </label>
                  <div className="price-tag">30,000원</div>
                </div>
                <div className="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      name="helmet" 
                      value="normal"
                      checked={selections.helmet === 'normal'}
                      onChange={handleRadioChange}
                    />
                    일반 헬멧
                  </label>
                  <div className="price-tag">10,000원</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 총액 */}
        <div className="total-section">
          <div className="total-label">💰 최종 결제액</div>
          <div className="total-amount">{formatCurrency(total)}</div>
          
          <div className="total-breakdown">
            <div className="breakdown-item">
              <span>🛌 숙박비</span>
              <span>{formatCurrency(breakdown.accommodation)}</span>
            </div>
            {breakdown.ski > 0 && (
              <div className="breakdown-item">
                <span>🎿 스키 이용료</span>
                <span>{formatCurrency(breakdown.ski)}</span>
              </div>
            )}
            {breakdown.skisuit > 0 && (
              <div className="breakdown-item">
                <span>👕 스키복 대여</span>
                <span>{formatCurrency(breakdown.skisuit)}</span>
              </div>
            )}
            {breakdown.shuttle > 0 && (
              <div className="breakdown-item">
                <span>🚌 셔틀 이용료</span>
                <span>{formatCurrency(breakdown.shuttle)}</span>
              </div>
            )}
            {breakdown.gloves > 0 && (
              <div className="breakdown-item">
                <span>🧤 장갑</span>
                <span>{formatCurrency(breakdown.gloves)}</span>
              </div>
            )}
            {breakdown.goggles > 0 && (
              <div className="breakdown-item">
                <span>🥽 고글</span>
                <span>{formatCurrency(breakdown.goggles)}</span>
              </div>
            )}
            {package_type === 'ski-accommodation' && (
              <div className="breakdown-item">
                <span>⛑️ 헬멧</span>
                <span>{formatCurrency(breakdown.helmet)}</span>
              </div>
            )}
            <div className="breakdown-item food-note">
              * 🍽️ 식비는 캠프 후 별도 정산 예정입니다.
            </div>
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <p>DanS 7기 스키캠프 | 문의: 카카오톡 단체 채팅방</p>
      </footer>
    </div>
  );
}

export default App;
