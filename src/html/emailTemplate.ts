export function generateSendOtpEmailContent(
  firstName: string,
  otpCode: string,
): string {
  const footer = generateFooter();
  const header = generateHeader();
  return getEmailTemplate(
    'Otp',
    `
        <h2 data-role="email-title"
            style="font-size:32px;font-weight:700;line-height:38px;text-align:center;color:#000;margin:16px auto;font-family: 'Roboto', 'Helvetica', 'Verdana', 'Arial', 'Georgia';">
            Hi ${firstName}</h2>
        <p data-role="text"
            style="margin:16px auto;text-align:center;color:#0F1A29;font-family: 'Roboto', 'Helvetica', 'Verdana', 'Arial', 'Georgia';font-size:16px;">
            Welcome and thanks for choosing miluxas.</p>
        <p data-role="primary-text"
            style="color:#4EB6C2;margin:16px 0;text-align: center;font-weight: 700;font-size:32px;font-family: 'Roboto', 'Helvetica', 'Verdana', 'Arial', 'Georgia';">
            ${otpCode}
        </p>
    `,
    footer,
    header,
  );
}

const getEmailTemplate = (
  title: string,
  content: string,
  footer: string,
  header: string,
): string => {
  return `

  <div data-role="container" style="padding:24px;max-width: 600px;margin:0 auto;background-color: #fff;">
       ${header}
        ${content}
        ${footer}
    </div>
`;
};

function generateFooter() {
  const twitterIconUrl = getMediaUrl('twitterIcon.png');
  const facebookIconUrl = getMediaUrl('facebookIcon.png');
  const linkedinIconUrl = getMediaUrl('linkedinIcon.png');
  return `<div data-role="footer-maybe" style="margin-top:148px;text-align:center;margin-bottom:24px;">
    <div data-role="social-medias">
        <a href="" data-role="social-link-tweitter" style="text-decoration: none;">
        <img src="${twitterIconUrl}" alt="twitter"
                style="display: inline-block;width: 18px;height:18px;object-fit:contain;margin:0 8px;">
        </a>
        <a href="" data-role="social-link-facebook" style="text-decoration: none;">
        <img src="${facebookIconUrl}" alt="facebook"
        style="display: inline-block;width: 18px;height:18px;object-fit:contain;margin:0 8px;">
        </a>
        <a href="" data-role="social-link-linkedin" style="text-decoration: none;">
        <img src="${linkedinIconUrl}" alt="linkedin"
        style="display: inline-block;width: 18px;height:18px;object-fit:contain;margin:0 8px;">
        </a>
    </div>
    <div data-role="product-title"
        style="margin:16px auto;text-align: center;font-family: 'Roboto', 'Helvetica', 'Verdana', 'Arial', 'Georgia';font-weight: 400;font-size:24px;color:#7F8080;">
        miluxas
    </div>
    <div data-role="copyright" style="font-size:12px;color:#A9A9A9;font-weight: 400;font-family: 'Roboto', 'Helvetica', 'Verdana', 'Arial', 'Georgia';">
        All right reserved by M ${new Date().getFullYear()} © <br>
    </div>
</div>`;
}

function generateHeader() {
  const miluxasIconUrl = getMediaUrl('miluxasLogo02.png');

  return ` 
    <div data-role="header" style="margin-bottom:33px;">
    <a href="#" data-role="header-logo">
        <img src="${miluxasIconUrl}" alt="miluxas">
    </a>
</div>
`;
}

export function generateContactUsFormFilledEmailContent(
  note: string,
  email: string,
  phone: string,
): string {
  return getEmailTemplate(
    'Contact Us Form Filled Email Template',
    `
              <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                  style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                  <tr>
                      <td style="height:40px;">&nbsp;</td>
                  </tr>
                  <tr>
                      <td style="padding:0 35px;">
                      <h2 style="color:#1e1e2d; font-weight:500; margin:0;font-family:'Rubik',sans-serif;">Hi, Admin!</h2>
                          <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">A contact us form is filled.</h1>
                          <span
                              style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                          <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                            Sender email: ${email}
                          </p>
                          <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                          Sender phone: ${phone}
                          </p>
                      <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                      Note: ${note}
                      </p>
                      </td>
                  </tr>
                  <tr>
                      <td style="height:40px;">&nbsp;</td>
                  </tr>
              </table>`,
    '',
    '',
  );
}

function getMediaUrl(name: string) {
  let endPointDomainName = process.env.S3_ENDPOINT;
  let endPointProtocol = '';
  if (process.env.S3_ENDPOINT.includes('https://')) {
    endPointDomainName = process.env.S3_ENDPOINT.split('https://')[1];
    endPointProtocol = 'https://';
  } else if (process.env.S3_ENDPOINT.includes('http://')) {
    endPointDomainName = process.env.S3_ENDPOINT.split('http://')[1];
    endPointProtocol = 'http://';
  }
  return (
    endPointProtocol +
    process.env.S3_BUCKET_NAME +
    '.' +
    endPointDomainName +
    '/defaultImages/' +
    name
  );
}

export function generateForgetPasswordOtpCodeContent(
  firstName: string,
  otpCode: string,
): string {
  const footer = generateFooter();
  const header = generateHeader();
  return getEmailTemplate(
    'Otp',
    `
          <h2 data-role="email-title"
              style="font-size:32px;font-weight:700;line-height:38px;text-align:center;color:#000;margin:16px auto;font-family: 'Roboto', 'Helvetica', 'Verdana', 'Arial', 'Georgia';">
              Hi ${firstName}</h2>
          <p data-role="text"
              style="margin:16px auto;text-align:center;color:#0F1A29;font-family: 'Roboto', 'Helvetica', 'Verdana', 'Arial', 'Georgia';font-size:16px;">Welcome and
              thanks for choosing miluxas.</p>
          <p data-role="primary-text"
              style="color:#4EB6C2;margin:16px 0;text-align: center;font-weight: 700;font-size:32px;font-family: 'Roboto', 'Helvetica', 'Verdana', 'Arial', 'Georgia';">
              ${otpCode}
          </p>
      `,
    footer,
    header,
  );
}

export function generateAdminForgetPasswordContent(
  firstName: string,
  resetLink: string,
): string {
  const footer = generateFooter();
  const header = generateHeader();
  return getEmailTemplate(
    'Rest password link',
    `
          <h2 data-role="email-title"
              style="font-size:32px;font-weight:700;line-height:38px;text-align:center;color:#000;margin:16px auto;font-family: 'Roboto', 'Helvetica', 'Verdana', 'Arial', 'Georgia';">
              Hi ${firstName}</h2>
          <p data-role="text"
              style="margin:16px auto;text-align:center;color:#0F1A29;font-family: 'Roboto', 'Helvetica', 'Verdana', 'Arial', 'Georgia';font-size:16px;">Welcome and
              thanks for choosing miluxas.</p>
          <div data-role="center-children" style="text-align:center;margin:0 0 24px 0;">
              <a href="${resetLink}" data-role="link-button"
                  style="cursor:pointer;background-color: #4EB6C2;border-radius: 4px;text-align:center;display:inline-block;padding:16px 40px;color:#fff;font-family: 'Roboto', 'Helvetica', 'Verdana', 'Arial', 'Georgia';font-weight: 600;text-decoration:none;">
Reset Password</a>
          </div>
      `,
    footer,
    header,
  );
}
