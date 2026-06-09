const fs = require("fs");
const path = require("path");

const selvaPath = path.join(__dirname, "..", "selva-vruthi.html");

let html = fs.readFileSync(selvaPath, "utf8");

// We need to replace the content inside <main class="main-content"> ... </main>
const mainStartTag = '<main class="main-content">';
const mainEndTag = '</main>';

const startIdx = html.indexOf(mainStartTag);
const endIdx = html.indexOf(mainEndTag);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find main tags!");
  process.exit(1);
}

const beforeMain = html.substring(0, startIdx + mainStartTag.length);
const afterMain = html.substring(endIdx);

const baseSvg = `
                  <svg width="220" height="20" viewBox="0 0 220 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                    <path d="M 5 10 L 85 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="91" cy="10" r="2.5" fill="#0d6153" />
                    <path d="M 96 10 L 102 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="110" cy="10" r="4.5" stroke="#0d6153" stroke-width="1.5" fill="none" />
                    <path d="M 118 10 L 124 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="129" cy="10" r="2.5" fill="#0d6153" />
                    <path d="M 135 10 L 215 10" stroke="#0d6153" stroke-width="1.5" />
                  </svg>
`;

// 1. Swarna Vruthi
const swarnaContent = `
      <div class="selva-vruthi-container" style="max-width: 1200px; margin: 40px auto; padding: 0 20px;">
        <div class="selva-vruthi-header" style="text-align: center; padding: 40px 20px; background: rgba(26, 95, 74, 0.03); border-radius: 12px; margin: 30px auto; max-width: 1200px; border: 1px solid rgba(26, 95, 74, 0.08);">
          <img src="swarna-tree.jpg" alt="Swarna Vruthi" style="width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 4px solid var(--secondary-color); box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom: 20px;" />
          <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 36px; color: var(--primary-color); margin: 0; font-weight: 700;">Swarna Vruthi</h1>
          <p style="color: var(--text-light); font-size: 16px; margin-top: 5px; font-weight: 500;">Savings Scheme</p>
        </div>

        <div class="scheme-cols" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; margin: 40px auto 50px auto; align-items: start;">
          <div class="scheme-left-col">
            <ul style="list-style: none; padding: 0; margin: 0 0 30px 0;">
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Start Saving with ₹2,000/- or in Multiples of ₹1,000/- (₹2,000, ₹3,000, ₹4,000, etc.)</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>The selected amount must be paid in 12 equal installments, on the due dates.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>All installments are accumulated in 22Kt Gold Weight Only based on the gold rate on the date of payment.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Protects savers from fluctuating gold prices by locking weight at each payment.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Regular monthly savers enjoy the 12th month installment paid by Swarnalaya.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>The scheme matures after 360 days from the date of enrollment.</span>
              </li>
            </ul>
            <div style="margin-bottom: 25px;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 15px; font-weight: 600; color: #852d24;">
                <input type="checkbox" id="agreeCheckbox" style="width: 18px; height: 18px; cursor: pointer;" />
                Agree the Terms & Conditions
              </label>
            </div>
            <button class="join-btn" id="joinNowBtn" style="background-color: var(--primary-color); color: #fff; border: none; padding: 12px 30px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
              Join Now
            </button>
          </div>

          <div class="scheme-right-col" style="background-color: #fff; border: 1.5px solid rgba(26, 95, 74, 0.1); border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
            <h3 style="font-size: 16px; color: #852d24; line-height: 1.6; margin-bottom: 20px; font-weight: 700; font-family: inherit;">
              For Example, If a customer joins the scheme with an Installment Amount of ₹5,000
            </h3>
            <table class="scheme-table" style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; text-align: center;">
              <thead>
                <tr style="background-color: #852d24; color: #fff;">
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Installment No</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Gold Price/g (22Kt)</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Accumulation Value</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Weight Accumulated</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: #ffffff; color: #1a1a1a;">
                  <td style="padding: 10px 6px; border: 1px solid #ddd; font-weight: 600;">Installment 1</td>
                  <td style="padding: 10px 6px; border: 1px solid #ddd; font-weight: 600;">₹ 7,000</td>
                  <td style="padding: 10px 6px; border: 1px solid #ddd; font-weight: 600;">₹ 5,000</td>
                  <td style="padding: 10px 6px; border: 1px solid #ddd; font-weight: 600; color: #1a5f4a;">0.714 gram</td>
                </tr>
                <tr style="background-color: #fafafa; color: #1a1a1a;">
                  <td style="padding: 10px 6px; border: 1px solid #ddd; font-weight: 600;">Installment 2</td>
                  <td style="padding: 10px 6px; border: 1px solid #ddd; font-weight: 600;">₹ 7,200</td>
                  <td style="padding: 10px 6px; border: 1px solid #ddd; font-weight: 600;">₹ 5,000</td>
                  <td style="padding: 10px 6px; border: 1px solid #ddd; font-weight: 600; color: #1a5f4a;">0.694 gram</td>
                </tr>
                <tr style="background-color: #ffffff; color: #1a1a1a;">
                  <td style="padding: 10px 6px; border: 1px solid #ddd; font-weight: 600;">Installment 12 (Free)</td>
                  <td style="padding: 10px 6px; border: 1px solid #ddd; font-weight: 600;">₹ 7,500</td>
                  <td style="padding: 10px 6px; border: 1px solid #ddd; font-weight: 600; color: #852d24;">₹ 5,000</td>
                  <td style="padding: 10px 6px; border: 1px solid #ddd; font-weight: 600; color: #1a5f4a;">0.667 gram</td>
                </tr>
              </tbody>
            </table>
            <div style="font-size: 14px; line-height: 1.6; color: var(--text-dark);">
              <p style="color: #852d24; font-weight: 700; margin-bottom: 10px;">Gold Rate is locked on the date of payment for each installment</p>
              <p style="color: var(--text-light); margin-bottom: 5px;">The above Illustration is given only for your Understanding</p>
              <p style="color: var(--text-light); font-weight: 500;">Savers receive equivalent physical gold weight at maturity</p>
            </div>
          </div>
        </div>

        <!-- Terms & FAQs Section -->
        <hr style="border: 0; border-top: 1px solid rgba(26, 95, 74, 0.1); margin: 50px 0;" />
        
        <div class="scheme-faqs-section" style="max-width: 1200px; margin: 0 auto 50px auto;">
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: var(--primary-color); text-align: center; margin-bottom: 45px; font-weight: 700;">
            Terms, Conditions & FAQs
          </h2>

          <div class="faq-grid">
            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Account Opening & Enrollment</h3>
                <div class="decorative-divider">${baseSvg}</div>
              </div>
              
              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Who is eligible to enroll in the Scheme ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The Scheme is open to individual persons only. Entities such as corporations, partnerships, trusts, HUFs and NRIs are not eligible. Minors may participate through natural guardians.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What is the minimum enrollment Amount in the Scheme ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The minimum enrollment amount is ₹2,000/- per month, and can be increased in multiples of ₹1,000/-.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>How are the installments accumulated ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Installments are accumulated in 22Kt Gold Weight based on the daily gold board rate on the date and time of payment.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What is the scheme benefit ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>If you pay 11 monthly installments regularly on time, Swarnalaya will pay the 12th installment absolutely free for you, and your gold asset weight is locked to secure against market price increases.</p>
                </div>
              </div>
            </div>

            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Monthly Payments</h3>
                <div class="decorative-divider">${baseSvg}</div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>How do I make monthly payments, and what documentation do I need ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Payments must be made monthly, on or before the due date, via cash, card, UPI, or online methods. The Scheme Book must be updated with each payment.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What happens if I miss a payment ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Missing installments shifts the maturity date and will result in the forfeiture of the 12th free installment discount.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="faq-grid" style="margin-top: 40px;">
            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Scheme Redemption</h3>
                <div class="decorative-divider">${baseSvg}</div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>How is the maturity date determined ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The Maturity date falls on the 360th day from the date of enrollment.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>How do I redeem my installments for jewellery ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Account holders must present the original Scheme Book and valid ID to purchase 22Kt gold jewellery against the accumulated gold weight. Making and value addition charges are payable by the customer.</p>
                </div>
              </div>
            </div>

            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Terms & Conditions</h3>
                <div class="decorative-divider">${baseSvg}</div>
              </div>

              <div style="background-color: #fff; border: 1px solid rgba(26, 95, 74, 0.08); border-radius: 8px; padding: 25px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.01); min-height: 250px;">
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 12px; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>Notify Swarnalaya immediately to block the account in case of loss. Responsibility lies with the holder until notified.</span>
                  </li>
                  <li style="margin-bottom: 12px; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>In the event of death, the Scheme can be transferred to the nominee, or to legal heirs providing a succession certificate.</span>
                  </li>
                  <li style="margin-bottom: 0; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>All disputes are strictly subject to the exclusive jurisdiction of the courts in Villupuram, Tamil Nadu.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
`;

// 2. Kubera Vruthi
const kuberaContent = `
      <div class="selva-vruthi-container" style="max-width: 1200px; margin: 40px auto; padding: 0 20px;">
        <div class="selva-vruthi-header" style="text-align: center; padding: 40px 20px; background: rgba(26, 95, 74, 0.03); border-radius: 12px; margin: 30px auto; max-width: 1200px; border: 1px solid rgba(26, 95, 74, 0.08);">
          <img src="kubera.jpg" alt="Kubera Vruthi" style="width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 4px solid var(--secondary-color); box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom: 20px;" />
          <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 36px; color: var(--primary-color); margin: 0; font-weight: 700;">Kubera Vruthi</h1>
          <p style="color: var(--text-light); font-size: 16px; margin-top: 5px; font-weight: 500;">Deposit Scheme</p>
        </div>

        <div class="scheme-cols" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; margin: 40px auto 50px auto; align-items: start;">
          <div class="scheme-left-col">
            <ul style="list-style: none; padding: 0; margin: 0 0 30px 0;">
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Upgrade Your Old Gold Jewellery to Brand New Gold Jewellery.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Requires a Minimum deposit of 8 grams 22Kt old gold jewellery.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Safe custody and gold weight protection for your asset during the deposit term.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Save 100% on Wastage and Value Addition (VA) when buying your new gold jewellery.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>The scheme matures after 360 days from the date of enrollment.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>All applicable government taxes will be levied.</span>
              </li>
            </ul>
            <div style="margin-bottom: 25px;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 15px; font-weight: 600; color: #852d24;">
                <input type="checkbox" id="agreeCheckbox" style="width: 18px; height: 18px; cursor: pointer;" />
                Agree the Terms & Conditions
              </label>
            </div>
            <button class="join-btn" id="joinNowBtn" style="background-color: var(--primary-color); color: #fff; border: none; padding: 12px 30px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
              Join Now
            </button>
          </div>

          <div class="scheme-right-col" style="background-color: #fff; border: 1.5px solid rgba(26, 95, 74, 0.1); border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
            <h3 style="font-size: 16px; color: #852d24; line-height: 1.6; margin-bottom: 20px; font-weight: 700; font-family: inherit;">
              For Example, If a customer deposits 10 grams of 22Kt old Gold
            </h3>
            <table class="scheme-table" style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; text-align: center;">
              <thead>
                <tr style="background-color: #852d24; color: #fff;">
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Deposited Weight</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Maturity Date</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Value Addition (VA) Discount</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Redeemable Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: #ffffff; color: #1a1a1a;">
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600;">10.000 grams</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600;">360 Days from Join</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600; color: #852d24;">100% Free Wastage</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600; color: #1a5f4a;">10.000 grams new jewellery</td>
                </tr>
              </tbody>
            </table>
            <div style="font-size: 14px; line-height: 1.6; color: var(--text-dark);">
              <p style="color: #852d24; font-weight: 700; margin-bottom: 10px;">Get equal weight of brand new gold jewellery with 0% Wastage</p>
              <p style="color: var(--text-light); margin-bottom: 5px;">The above Illustration is given only for your Understanding</p>
              <p style="color: var(--text-light); font-weight: 500;">Wastage and Value Addition charges are fully waived at maturity</p>
            </div>
          </div>
        </div>

        <!-- Terms & FAQs Section -->
        <hr style="border: 0; border-top: 1px solid rgba(26, 95, 74, 0.1); margin: 50px 0;" />
        
        <div class="scheme-faqs-section" style="max-width: 1200px; margin: 0 auto 50px auto;">
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: var(--primary-color); text-align: center; margin-bottom: 45px; font-weight: 700;">
            Terms, Conditions & FAQs
          </h2>

          <div class="faq-grid">
            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Account Opening & Enrollment</h3>
                <div class="decorative-divider">${baseSvg}</div>
              </div>
              
              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Who is eligible to enroll in the Scheme ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The Scheme is open to individual persons only. Entities such as corporations, partnerships, trusts, HUFs and NRIs are not eligible.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What is the minimum enrollment Amount in the Scheme ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The minimum deposit is 8 grams of 22Kt old gold jewellery.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What is the scheme benefit ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Upon maturity, you receive brand new gold jewellery matching the weight of gold deposited, with a 100% waiver on value addition (wastage) charges.</p>
                </div>
              </div>
            </div>

            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Deposit Details</h3>
                <div class="decorative-divider">${baseSvg}</div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>How is the gold weight determined ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The old gold jewellery will be melted, assay tested, and the net weight of pure 22Kt gold is recorded and locked for the scheme book.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Are there any monthly payments ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>No. This is a one-time gold deposit scheme. No monthly installments are required.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="faq-grid" style="margin-top: 40px;">
            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Scheme Redemption</h3>
                <div class="decorative-divider">${baseSvg}</div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>How do I redeem my deposit ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>At maturity, present the scheme book and ID to choose new 22Kt gold jewellery of equivalent weight with 100% VA charges waived.</p>
                </div>
              </div>
            </div>

            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Terms & Conditions</h3>
                <div class="decorative-divider">${baseSvg}</div>
              </div>

              <div style="background-color: #fff; border: 1px solid rgba(26, 95, 74, 0.08); border-radius: 8px; padding: 25px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.01); min-height: 200px;">
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 12px; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>Deposited gold cannot be returned in its original physical form under any circumstances once melted.</span>
                  </li>
                  <li style="margin-bottom: 0; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>All disputes are subject to the exclusive jurisdiction of the courts in Villupuram, Tamil Nadu.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
`;

// 3. Kanagha Vruthi
const kanaghaContent = `
      <div class="selva-vruthi-container" style="max-width: 1200px; margin: 40px auto; padding: 0 20px;">
        <div class="selva-vruthi-header" style="text-align: center; padding: 40px 20px; background: rgba(26, 95, 74, 0.03); border-radius: 12px; margin: 30px auto; max-width: 1200px; border: 1px solid rgba(26, 95, 74, 0.08);">
          <img src="kanagha-coin-set.jpg" alt="Kanagha Vruthi" style="width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 4px solid var(--secondary-color); box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom: 20px;" />
          <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 36px; color: var(--primary-color); margin: 0; font-weight: 700;">Kanagha Vruthi</h1>
          <p style="color: var(--text-light); font-size: 16px; margin-top: 5px; font-weight: 500;">Smart Gold Scheme</p>
        </div>

        <div class="scheme-cols" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; margin: 40px auto 50px auto; align-items: start;">
          <div class="scheme-left-col">
            <ul style="list-style: none; padding: 0; margin: 0 0 30px 0;">
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Start Accumulating gold weight with just ₹100/- a Day!</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Easily pay, track, and manage your gold savings through our Mobile App.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Small daily or flexible savings grow into a physical gold weight asset.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Fully secure digital gold weight accumulation locked at the daily gold rate.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>The scheme matures after 360 days from the date of enrollment.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Redeem gold coins or physical gold jewellery at maturity.</span>
              </li>
            </ul>
            <div style="margin-bottom: 25px;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 15px; font-weight: 600; color: #852d24;">
                <input type="checkbox" id="agreeCheckbox" style="width: 18px; height: 18px; cursor: pointer;" />
                Agree the Terms & Conditions
              </label>
            </div>
            <button class="join-btn" id="joinNowBtn" style="background-color: var(--primary-color); color: #fff; border: none; padding: 12px 30px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
              Join Now
            </button>
          </div>

          <div class="scheme-right-col" style="background-color: #fff; border: 1.5px solid rgba(26, 95, 74, 0.1); border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
            <h3 style="font-size: 16px; color: #852d24; line-height: 1.6; margin-bottom: 20px; font-weight: 700; font-family: inherit;">
              For Example, If a customer saves ₹100 a day for 360 days (Total: ₹36,000)
            </h3>
            <table class="scheme-table" style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; text-align: center;">
              <thead>
                <tr style="background-color: #852d24; color: #fff;">
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Total Saved Amount</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Maturity Term</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Convenience</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Redemption Asset</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: #ffffff; color: #1a1a1a;">
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600;">₹ 36,000</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600;">360 Days</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600; color: #852d24;">Pay daily via App</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600; color: #1a5f4a;">Equivalent Weight in Gold Coins/Jewellery</td>
                </tr>
              </tbody>
            </table>
            <div style="font-size: 14px; line-height: 1.6; color: var(--text-dark);">
              <p style="color: #852d24; font-weight: 700; margin-bottom: 10px;">Track rate daily and accumulate gold with small amounts</p>
              <p style="color: var(--text-light); margin-bottom: 5px;">The above Illustration is given only for your Understanding</p>
              <p style="color: var(--text-light); font-weight: 500;">Gold rate is locked for each deposit transaction instantly</p>
            </div>
          </div>
        </div>

        <!-- Terms & FAQs Section -->
        <hr style="border: 0; border-top: 1px solid rgba(26, 95, 74, 0.1); margin: 50px 0;" />
        
        <div class="scheme-faqs-section" style="max-width: 1200px; margin: 0 auto 50px auto;">
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: var(--primary-color); text-align: center; margin-bottom: 45px; font-weight: 700;">
            Terms, Conditions & FAQs
          </h2>

          <div class="faq-grid">
            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Account Opening & Enrollment</h3>
                <div class="decorative-divider">${baseSvg}</div>
              </div>
              
              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Who is eligible to enroll in the Scheme ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The Scheme is open to individual persons only. Registrations are done online or in-store.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What is the minimum enrollment Amount in the Scheme ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>savers can start accumulating gold weight with a deposit of just ₹100/- a day.</p>
                </div>
              </div>
            </div>

            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Daily Payments</h3>
                <div class="decorative-divider">${baseSvg}</div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>How do I pay daily ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Use our dedicated Swarnalaya Mobile App to make daily payments via UPI, Debit Card, Net Banking, or set up Auto-debit.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Is daily payment compulsory ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>No, you can pay daily, weekly, or accumulate in advance as per your convenience.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="faq-grid" style="margin-top: 40px;">
            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Scheme Redemption</h3>
                <div class="decorative-divider">${baseSvg}</div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What do I get at maturity ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>At maturity (360 days), you can redeem the total gold weight accumulated for physical gold coins or jewellery at any Swarnalaya showroom.</p>
                </div>
              </div>
            </div>

            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Terms & Conditions</h3>
                <div class="decorative-divider">${baseSvg}</div>
              </div>

              <div style="background-color: #fff; border: 1px solid rgba(26, 95, 74, 0.08); border-radius: 8px; padding: 25px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.01); min-height: 200px;">
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 12px; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>App transactions are processed securely. Digital records in the app serve as official ledger evidence.</span>
                  </li>
                  <li style="margin-bottom: 0; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>All disputes are strictly subject to the exclusive jurisdiction of the courts in Villupuram, Tamil Nadu.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
`;

// Helper function to write files
function generateFile(filename, content, titleName) {
  let fileHtml = beforeMain + content + afterMain;
  // Replace alert texts using RegExp with standard concatenation
  fileHtml = fileHtml.replace(/alert\("Thank you for joining the Selva Vruthi Cash Scheme!"\);/, 'alert("Thank you for joining the ' + titleName + '!");');
  fileHtml = fileHtml.replace(/alert\("Thank you for joining the Thanaa Vruthi Cash Scheme!"\);/, 'alert("Thank you for joining the ' + titleName + '!");');
  
  fs.writeFileSync(path.join(__dirname, "..", filename), fileHtml, "utf8");
  console.log("Generated:", filename);
}

generateFile("swarna-vruthi.html", swarnaContent, "Swarna Vruthi Savings Scheme");
generateFile("kubera-vruthi.html", kuberaContent, "Kubera Vruthi Deposit Scheme");
generateFile("kanagha-vruthi.html", kanaghaContent, "Kanagha Vruthi Smart Gold Scheme");

console.log("All other scheme pages generated successfully!");
