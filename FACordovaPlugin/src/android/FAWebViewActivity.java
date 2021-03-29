package cordova.plugin.followanalytics;

import android.graphics.Color;
import android.graphics.Typeface;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.RelativeLayout.LayoutParams;


import com.followapps.android.FAWebView;

public class FAWebViewActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String url = getIntent().getStringExtra("url");
        String title = getIntent().getStringExtra("title");
        String button = getIntent().getStringExtra("button");

        RelativeLayout relativeLayout = new RelativeLayout(this);
        TextView textView = new TextView(this);
        Button btn = new Button(this);
        FAWebView site = new FAWebView(this);

        // Relative Layout

        LayoutParams relativeLayoutParams = new RelativeLayout.LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT
        );

        relativeLayout.setLayoutParams(relativeLayoutParams);

        // TextView Layout

        LayoutParams textLayoutParams = new RelativeLayout.LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.WRAP_CONTENT
        );

        textLayoutParams.height = 150;
        textView.setLayoutParams(textLayoutParams);
        textView.setText(title);
        textView.setTextColor(Color.parseColor("#000000"));
        textView.setTextSize(18);
        textView.setTypeface(Typeface.DEFAULT_BOLD);
        textView.setGravity(Gravity.CENTER);

        relativeLayout.addView(textView);

        // Button Layout

        LayoutParams buttonLayoutParams = new RelativeLayout.LayoutParams(
                LayoutParams.WRAP_CONTENT,
                LayoutParams.WRAP_CONTENT
        );

        buttonLayoutParams.height = 150;
        buttonLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
        btn.setBackgroundColor(Color.TRANSPARENT);
        btn.setLayoutParams(buttonLayoutParams);
        btn.setText(button);
        btn.setOnClickListener(this::closeView);

        relativeLayout.addView(btn);


        // FAWebView Layout

        LayoutParams WebViewLayoutParams = new RelativeLayout.LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT
        );

        WebViewLayoutParams.topMargin = 150;
        site.setLayoutParams(WebViewLayoutParams);
        site.setBackgroundColor(Color.parseColor("#cccccc"));
        site.loadUrl(url);

        relativeLayout.addView(site);

        setContentView(relativeLayout);
    }

    public void closeView(View view) {
        finish();
    }
}
