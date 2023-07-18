// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

type Data = {
  name: string;
};

const generatePdf = async (path: any) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto("http://"+path);
    const image = await page.screenshot({ fullPage: true });
    await browser.close();
    return image;
  } catch (error) {
    console.log(error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { slug } = req.query
  console.log(JSON.stringify(slug));
  try {
    const result: any = await generatePdf(req?.headers?.host);
    res.setHeader("content-type", "image/png");
    if (result) {
      res.status(200).send(result);
    }
  } catch (err) {
    res.status(500).json({ error: "failed to load data" });
  }
}