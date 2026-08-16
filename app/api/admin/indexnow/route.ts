import { NextResponse } from "next/server";
import https from "https";

const INDEXNOW_KEY = "raqmana2026indexnowkey789";
const BASE_URL = "https://www.raqmanadz.com";

async function sendIndexNow(urls: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      host: "www.raqmanadz.com",
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    });

    const options = {
      hostname: "api.indexnow.org",
      path: "/indexnow",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let d = "";
      res.on("data", (chunk) => (d += chunk));
      res.on("end", () => {
        resolve(res.statusCode === 200 || res.statusCode === 202);
      });
    });

    req.on("error", (e) => {
      console.warn("IndexNow API error:", e.message);
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { passcode, url, slug } = body;

    const validPasscode = process.env.ADMIN_PUBLISH_PASSCODE || "@belaiba28026@";
    if (passcode !== validPasscode) {
      return NextResponse.json(
        { message: "الرمز السري الخاص بالتحكم غير صحيح" },
        { status: 401 }
      );
    }

    let targetUrl = url;
    if (!targetUrl && slug) {
      targetUrl = `${BASE_URL}/articles/${slug}`;
    }

    if (!targetUrl) {
      return NextResponse.json(
        { message: "يرجى تحديد الرابط أو الرمز (slug) المطلوب أرشفته" },
        { status: 400 }
      );
    }

    const urlsToSubmit = [targetUrl, `${BASE_URL}/articles`];
    const success = await sendIndexNow(urlsToSubmit);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `تم إرسال طلب الأرشفة الفورية بنجاح للرابط: ${targetUrl}`,
        submittedUrls: urlsToSubmit,
      });
    } else {
      return NextResponse.json(
        { message: "تم إرسال الطلب لكن محرك البحث أرجع تنبيهاً، يرجى إعادة المحاولة لاحقاً" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("IndexNow API Route error:", error);
    return NextResponse.json(
      { message: error.message || "حدث خطأ أثناء الاتصال بمحركات البحث" },
      { status: 500 }
    );
  }
}
