// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import path from "path";
import fsPromises from "fs/promises";


const generatePdf = async (keys: Array<string>, values: Array<string>) => {
  const data = keys.map((k, index) => {
    return { name: k, percent: values[index] };
  });

  try {
    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();
    page.setViewport({
      height: 350,
      width: 500,
      deviceScaleFactor: 5,
    });

    const htmlPath = path.join(process.cwd(), "/pages/api/dist/index.html");
    const jsPath = path.join(process.cwd(), "/pages/api/dist/assets/index.js");
    const cssPath = path.join(process.cwd(), "/pages/api/dist/assets/index.css");
    const htmlBuffer = await fsPromises.readFile(htmlPath);
    const jsBuffer = await fsPromises.readFile(jsPath);
    const cssBuffer = await fsPromises.readFile(cssPath);
    const htmlContent = htmlBuffer.toString();
    const jsContent = jsBuffer.toString();
    const cssContent = cssBuffer.toString();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    await page.evaluate((val) => {
      // @ts-ignore
      document.chartData = val.data;
      document.getElementsByTagName("script")[0].remove();
      document.getElementsByTagName("link")[0].remove();

      let script = document.createElement("script");
      script.text = val.js;
      script.async = true;
      document.head.appendChild(script);

      var style = document.createElement("style");
      style.innerText = val.css
      document.head.appendChild(style);
    }, {data: data, js: jsContent, css: cssContent});

    await page.waitForSelector("#chart-loaded", {
      visible: true,
    });

    const image = await page.screenshot({ fullPage: true });
    await browser.close();
    return image;
  } catch (error) {
    console.log(error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  //@ts-ignore
  const keys = slug[0].split(",");
  //@ts-ignore
  const values = slug[1].split(",");

  try {
    const result: any = await generatePdf(keys, values);
    res.setHeader("content-type", "image/png");
    if (result) {
      res.status(200).send(result);
    }
  } catch (err) {
    res.status(500).json({ error: "failed to load data" });
  }
}
