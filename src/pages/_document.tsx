import Document, { Head, Html, Main, NextScript } from 'next/document';
import LoadingSpinner from '@/components/utils/spinners/loading/LoadingSpinner';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id="globalLoader">
            <LoadingSpinner />
            {/*<img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="" />*/}
          </div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
