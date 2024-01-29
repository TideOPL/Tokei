import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta name="theme-color" content="#FEFEFE" media="(prefers-color-scheme: light)" />
                <meta name="theme-color" content="#1a1b1e" media="(prefers-color-scheme: dark)" />
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}