import { ShadowOption, WindowOption, OUTPUT_IMAGE_HEIGHT, WINDOW_TOP_BAR_HEIGHT } from "./getScreenshot";
import HtmlPage from "./HtmlPage";

export default function getHtml(imageBase64: string, shadow?: ShadowOption, radius?: number, window?: WindowOption) {
  const page = new HtmlPage();

  page.addGlobalStyle(`
    body {
      display: flex;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .container, .container > div {
      height: ${OUTPUT_IMAGE_HEIGHT}px;
    }
    img {
      height: ${window && window !== "none" ? OUTPUT_IMAGE_HEIGHT - WINDOW_TOP_BAR_HEIGHT : OUTPUT_IMAGE_HEIGHT}px;
    }`);

  page.addImageSrc(`data:image/png;base64,${imageBase64}`);

  switch (shadow) {
    case "small":
      page.addGlobalStyle(`
      .container {
        margin-top: 5px;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
      }`);
      break;
    case "medium":
      page.addGlobalStyle(`
      .container {
        margin-top: 10px;
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
      }`);
      break;
    case "large":
      page.addGlobalStyle(`
      .container {
        margin-top: 15px;
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.1);
      }`);
      break;
  }

  if (radius) {
    page.addGlobalStyle(`
    .container {
      border-radius: ${radius}px;
      overflow: hidden;
    }`);
  }

  if (window === "mac-os") {
    page.addGlobalStyle(`
      .macos-window {
        display: flex;
        height: ${WINDOW_TOP_BAR_HEIGHT}px;
        border-bottom: 1px solid #e2e8f0;
        background-image: linear-gradient(#fff, #eee);
      }

      .macos-buttons {
        display: flex;
        align-items: center;
        height: 100%;
        margin-left: 0.75rem;
      }

      .macos-button {
        display: inline-block;
        width: 0.75rem;
        height: 0.75rem;
        margin-left: 0.25rem;
        margin-right: 0.25rem;
        border-radius: 9999px;
      }
      .bg-red-500 {
        background-color: #f56565;
      }
      .bg-yellow-500 {
        background-color: #ecc94b;
      }
      .bg-green-500 {
        background-color: #48bb78;
      }`);

    page.addWrapper(
      content => `
        <div>
          <div class="macos-window">
            <div class="macos-buttons">
              <span class="bg-red-500 macos-button"></span>
              <span class="bg-yellow-500 macos-button"></span>
              <span class="bg-green-500 macos-button"></span>
            </div>
          </div>${content}
        </div>`
    );
  }

  return page.html;
}
