const fs = require("fs");
const path = require("path");

const selvaPath = path.join(__dirname, "..", "selva-vruthi.html");
const thanaaPath = path.join(__dirname, "..", "thanaa-vruthi.html");

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

const thanaaMainContent = `
      <div class="selva-vruthi-container" style="max-width: 1200px; margin: 40px auto; padding: 0 20px;">
        <div class="selva-vruthi-header" style="text-align: center; padding: 40px 20px; background: rgba(26, 95, 74, 0.03); border-radius: 12px; margin: 30px auto; max-width: 1200px; border: 1px solid rgba(26, 95, 74, 0.08);">
          <img src="thanaa-cash.png" alt="Thanaa Vruthi" style="width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 4px solid var(--secondary-color); box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom: 20px;" />
          <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 36px; color: var(--primary-color); margin: 0; font-weight: 700;">Thanaa Vruthi</h1>
          <p style="color: var(--text-light); font-size: 16px; margin-top: 5px; font-weight: 500;">Cash Scheme</p>
        </div>

        <div class="scheme-cols" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; margin: 40px auto 50px auto; align-items: start;">
          <div class="scheme-left-col">
            <ul style="list-style: none; padding: 0; margin: 0 0 30px 0;">
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Start Saving with 1,000 or in Multiples of ₹1,000 (₹1,000, ₹2,000, ₹3,000, etc.)</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>The selected amount must be paid in 12 equal installments, on the due dates.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>All installments are accumulated in cash only. The scheme will mature after 360 days from the date of enrollment.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Upon maturity, you can purchase gold jewellery with a discount of up to 15% on the Value Addition for the amount accumulated.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>Avail a 40% discount on the Value Addition when purchasing diamond or gemstone jewellery.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 15px; color: var(--text-dark); line-height: 1.6;">
                <i class="fas fa-certificate" style="color: #137333; font-size: 16px; margin-top: 4px;"></i>
                <span>All applicable government taxes will be levied.</span>
              </li>
            </ul>
            <div style="margin-bottom: 25px;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 15px; font-weight: 600; color: #852d24;">
                <input type="checkbox" id="agreeCheckbox" style="width: 18px; height: 18px; cursor: pointer;" />
                Agree the Tearms & Conditions
              </label>
            </div>
            <button class="join-btn" id="joinNowBtn" style="background-color: var(--primary-color); color: #fff; border: none; padding: 12px 30px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
              Join Now
            </button>
          </div>

          <div class="scheme-right-col" style="background-color: #fff; border: 1.5px solid rgba(26, 95, 74, 0.1); border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
            <h3 style="font-size: 16px; color: #852d24; line-height: 1.6; margin-bottom: 20px; font-weight: 700; font-family: inherit;">
              For Example, If a customer joins the scheme on 01st Jan 2025, with an Installment Amount of ₹5,000
            </h3>
            <table class="scheme-table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; text-align: center;">
              <thead>
                <tr style="background-color: #852d24; color: #fff;">
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Total Amount Accumulated</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Maturity Date</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Gold Rate on the date of Maturity</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Total Weight (22KT) Accumulated</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: #fafafa; color: #1a1a1a;">
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600; color: #1a5f4a;">₹60000</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600;">26-DEC-2025</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600;">₹7,000</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600;">8.517gram</td>
                </tr>
              </tbody>
            </table>
            
            <table class="scheme-table" style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; text-align: center;">
              <thead>
                <tr style="background-color: #852d24; color: #fff;">
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Value Addition (%)</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Discount</th>
                  <th style="padding: 10px 6px; font-weight: 600; border: 1px solid #ddd; font-family: inherit;">Value Addition to be paid for Accumulated Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: #ffffff; color: #1a1a1a;">
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600;">18%</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600; color: #1a5f4a;">₹9,000</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600; color: #852d24;">₹1,800</td>
                </tr>
                <tr style="background-color: #fafafa; color: #1a1a1a;">
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600;">15%</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600; color: #1a5f4a;">₹9,000</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600;">0</td>
                </tr>
                <tr style="background-color: #ffffff; color: #1a1a1a;">
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600;">12%</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600; color: #1a5f4a;">₹9,000</td>
                  <td style="padding: 12px 6px; border: 1px solid #ddd; font-weight: 600;">0</td>
                </tr>
              </tbody>
            </table>
            
            <div style="font-size: 14px; line-height: 1.6; color: var(--text-dark);">
              <p style="color: #852d24; font-weight: 700; margin-bottom: 10px;">Value Addition is applicable on purchase under this Scheme</p>
              <p style="color: var(--text-light); margin-bottom: 5px;">The above Illustration is given only for your Understanding</p>
              <p style="color: var(--text-light); font-weight: 500;">the gold Rate Will Be Calculated on the date of Purchase Only</p>
            </div>
          </div>
        </div>

        <!-- Terms & FAQs Section -->
        <hr style="border: 0; border-top: 1px solid rgba(26, 95, 74, 0.1); margin: 50px 0;" />
        
        <div class="scheme-faqs-section" style="max-width: 1200px; margin: 0 auto 50px auto;">
          <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: var(--primary-color); text-align: center; margin-bottom: 45px; font-weight: 700;">
            Terms, Conditions & FAQs
          </h2>

          <!-- Row 1: Account Opening & Monthly Payments -->
          <div class="faq-grid">
            <!-- Category: Account Opening & Enrollment -->
            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Account Opening & Enrollment</h3>
                <div class="decorative-divider">
                  <svg width="220" height="20" viewBox="0 0 220 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                    <path d="M 5 10 L 85 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="91" cy="10" r="2.5" fill="#0d6153" />
                    <path d="M 96 10 L 102 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="110" cy="10" r="4.5" stroke="#0d6153" stroke-width="1.5" fill="none" />
                    <path d="M 118 10 L 124 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="129" cy="10" r="2.5" fill="#0d6153" />
                    <path d="M 135 10 L 215 10" stroke="#0d6153" stroke-width="1.5" />
                  </svg>
                </div>
              </div>
              
              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Who is eligible to enroll in the Scheme ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The Scheme is open to individual persons only. Entities such as corporations, partnerships, proprietorships, trusts, Hindu Undivided Families (HUF) and Non-Resident Indians (NRIs) are not eligible. Minors may participate through their natural guardians.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What is the minimum enrollment Amount in the Scheme ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The minimum enrollment amount is ₹1,000/- per month, and can be increased in multiples of ₹1,000/-.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What is the Scheme Book and how should it be handled ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The Scheme Book is a record book issued at enrollment to record all installment payments. It must be presented for every payment and kept safe. A duplicate Scheme Book can be issued after the account holder files a police report (FIR) and provides an indemnity letter on Rs.200/- stamp paper along with photo ID and address proof.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What happens if there are discrepancies in my Scheme Book ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Any discrepancies must be reported immediately in writing to Swarnalaya management for verification and rectification.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What if I change my contact or address details ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Account holders must notify Swarnalaya immediately with valid photo ID and address proof to update system contact and shipping information.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Can I transfer my enrollment to another scheme or convert it to another currency ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>No. Schemes are non-transferable and conversion between gold value accumulation or cash value schemes is not permitted.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>How are the installments accumulated ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>For Thanaa Vruthi, installments are accumulated in Cash value only.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What is the scheme benefit ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Upon maturity, you receive a discount of up to 15% on the Value Addition (wastage) when purchasing gold jewellery, or a 40% discount on the Value Addition when purchasing diamond or gemstone jewellery.</p>
                </div>
              </div>
            </div>

            <!-- Category: Monthly Payments -->
            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Monthly Payments</h3>
                <div class="decorative-divider">
                  <svg width="220" height="20" viewBox="0 0 220 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                    <path d="M 5 10 L 85 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="91" cy="10" r="2.5" fill="#0d6153" />
                    <path d="M 96 10 L 102 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="110" cy="10" r="4.5" stroke="#0d6153" stroke-width="1.5" fill="none" />
                    <path d="M 118 10 L 124 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="129" cy="10" r="2.5" fill="#0d6153" />
                    <path d="M 135 10 L 215 10" stroke="#0d6153" stroke-width="1.5" />
                  </svg>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>How do I make monthly payments, and what documentation do I need ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Payments must be made monthly, on or before the due date, via cash, card, UPI, or online methods. Each payment must be documented by requesting a computerized receipt or by collecting an updated receipt from the Store. The Scheme Book must be updated with each payment.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Can I make all or any monthly payments in advance ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Yes, advance payments of monthly installments are accepted. However, the maturity date remains calculated at 360 days from joining.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>How is monthly installment date calculated ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The monthly due date matches the calendar date of joining (e.g. if joined on Jan 5th, due date is on or before 5th of subsequent months).</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Is monthly installment Amount fixed ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Yes, the monthly installment amount chosen at joining remains fixed and cannot be changed during the scheme tenure.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What if online transaction is failed ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Check with your bank/payment gateway. Failed payments do not count as paid until the money is credited to Swarnalaya's account.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Are there any payment methods Swarnalaya does not accept ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Outstation checks, credit cards from unapproved issuers, and select payment systems are not accepted. Verify list at store.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Am I responsible for ensuring payments are made on time ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Yes, it is the sole responsibility of the account holder to pay the installments regularly on time.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What happens if I miss a payment ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Missing installments shifts maturity date by one month for each missed month, and may cause forfeiture of the value addition discount benefits.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Row 2: Scheme Redemption & Terms -->
          <div class="faq-grid" style="margin-top: 40px;">
            <!-- Category: Scheme Redemption -->
            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Scheme Redemption</h3>
                <div class="decorative-divider">
                  <svg width="220" height="20" viewBox="0 0 220 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                    <path d="M 5 10 L 85 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="91" cy="10" r="2.5" fill="#0d6153" />
                    <path d="M 96 10 L 102 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="110" cy="10" r="4.5" stroke="#0d6153" stroke-width="1.5" fill="none" />
                    <path d="M 118 10 L 124 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="129" cy="10" r="2.5" fill="#0d6153" />
                    <path d="M 135 10 L 215 10" stroke="#0d6153" stroke-width="1.5" />
                  </svg>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>How is the maturity date determined ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The Maturity date falls on the 360th day from the date of joining.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>How do I redeem my installments for jewellery ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Account holders must present the original Scheme Book along with valid photo ID and address proof at the Swarnalaya store to purchase jewellery against the accumulated amount.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What kind of products is eligible to purchase under this Scheme ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>You can purchase Gold, Diamond, Platinum, and Silver jewellery as per your preference.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What additional charges apply when redeeming the Scheme for jewellery ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>Making charges, wastage (value addition - VA), and government taxes (GST) on the chosen jewellery are payable by the customer.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Can I redeem part of my Scheme account or receive a refund ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>No. Partial redemptions are not permitted. Under no circumstances will cash refunds be issued; accumulated value must be redeemed for jewellery only.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>What happens if I close my Scheme account prematurely ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>In case of premature closure, you can buy jewellery for the paid amount, but you will not receive the value addition discount benefits.</p>
                </div>
              </div>

              <div class="faq-accordion-item">
                <div class="faq-question">
                  <span>Can I club both the scheme benefits and the Prevailing Offers / Discounts on redemption of the scheme ?</span>
                  <i class="fas fa-chevron-down faq-arrow"></i>
                </div>
                <div class="faq-answer">
                  <p>The scheme cannot be clubbed with other promotional discounts or offers unless explicitly permitted by Swarnalaya management at redemption.</p>
                </div>
              </div>
            </div>

            <!-- Category: Terms & Conditions Card -->
            <div class="faq-category">
              <div class="faq-heading-container">
                <h3>Terms & Conditions</h3>
                <div class="decorative-divider">
                  <svg width="220" height="20" viewBox="0 0 220 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                    <path d="M 5 10 L 85 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="91" cy="10" r="2.5" fill="#0d6153" />
                    <path d="M 96 10 L 102 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="110" cy="10" r="4.5" stroke="#0d6153" stroke-width="1.5" fill="none" />
                    <path d="M 118 10 L 124 10" stroke="#0d6153" stroke-width="1.5" />
                    <circle cx="129" cy="10" r="2.5" fill="#0d6153" />
                    <path d="M 135 10 L 215 10" stroke="#0d6153" stroke-width="1.5" />
                  </svg>
                </div>
              </div>

              <div style="background-color: #fff; border: 1px solid rgba(26, 95, 74, 0.08); border-radius: 8px; padding: 25px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.01); min-height: 380px;">
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 15px; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>Immediately notify Swarnalaya in writing or by email to block the account. The account holder will bear full responsibility for any redemptions or purchases made by another party prior to such notification.</span>
                  </li>
                  <li style="margin-bottom: 15px; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>In the event of loss, a duplicate Scheme Book can be issued after the account holder files a police report (FIR). An indemnity letter on Rs.200/- non-judicial stamp paper, along with valid photo ID and address proof, is required.</span>
                  </li>
                  <li style="margin-bottom: 15px; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>In the event of the account holder’s death, the Scheme may be transferred to the nominated beneficiary, subject to identity and address proofs. If no nomination exists, legal heirs must provide necessary documents such as the death certificate, succession certificate, NOC from other legal heirs, and an indemnity undertaking.</span>
                  </li>
                  <li style="margin-bottom: 15px; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>Yes. Swarnalaya reserves the right to modify, amend, or discontinue the Scheme without prior notice, as long as such changes are not detrimental to the account holder’s interests.</span>
                  </li>
                  <li style="margin-bottom: 15px; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>Swarnalaya’s liability is strictly limited to the amounts of installments paid by the account holder and the corresponding discounts. No additional warranties or guarantees are implied.</span>
                  </li>
                  <li style="margin-bottom: 15px; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>Any disputes will be subject to the exclusive jurisdiction of the courts in Villupuram, Tamil Nadu.</span>
                  </li>
                  <li style="margin-bottom: 0; font-size: 14px; color: var(--text-dark); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="fas fa-gavel" style="color: #852d24; margin-top: 3px; font-size: 13px;"></i>
                    <span>Swarnalaya reserves the right to amend or discontinue the Scheme in accordance with changes in laws or regulatory requirements. The account holder agrees to comply with such changes.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
`;

const fullHtml = beforeMain + thanaaMainContent + afterMain;
fs.writeFileSync(thanaaPath, fullHtml, "utf8");
console.log("Successfully generated thanaa-vruthi.html!");
