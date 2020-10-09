package kr.bfk.gurilunch;

import android.os.*;
import android.support.v7.app.*;
import android.webkit.*;

public class MainActivity extends AppCompatActivity 
{
	WebView web;
	
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
		
		web = (WebView)findViewById(R.id.webView1);
		
		web.setWebViewClient(new WebViewClient());
		WebSettings webset = web.getSettings();
		webset.setBuiltInZoomControls(true);
		webset.setJavaScriptEnabled(true);
		
		web.loadUrl("https://bfkkutu.kr/lunch");
    }
}
