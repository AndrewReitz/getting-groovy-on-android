package com.andrewreitz.test

import android.app.Activity
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import com.arasthel.swissknife.SwissKnife
import com.arasthel.swissknife.annotations.InjectView
import com.arasthel.swissknife.annotations.OnBackground
import com.arasthel.swissknife.annotations.OnClick
import com.arasthel.swissknife.annotations.OnUIThread
import groovy.transform.CompileStatic

import static android.view.View.GONE
import static android.view.View.VISIBLE

@CompileStatic class MainActivity extends Activity {

  @InjectView(R.id.main_groovy_image) ImageView groovyImage
  @InjectView(R.id.main_button_do_work) Button doWorkButton
  @InjectView(R.id.main_text_view) TextView textView

  @OnClick(R.id.main_groovy_image) void clearWork() {
    groovyImage.visibility = GONE
    doWorkButton.visibility = VISIBLE
    textView.visibility = VISIBLE
  }

  @OnClick(R.id.main_button_do_work) void doWork() {
    loadImage()
  }

  @OnBackground void loadImage() {
    String url = "http://groovy.codehaus.org/images/groovy-logo-medium.png"

    InputStream inputStream = new URL(url).openStream();
    def bitmap = BitmapFactory.decodeStream(inputStream)

    setImage(bitmap)
  }

  @OnUIThread() public void setImage(Bitmap bitmap){
    groovyImage.visibility = VISIBLE
    textView.visibility = GONE
    doWorkButton.visibility = GONE
    groovyImage.setImageBitmap(bitmap)
  }

  @Override protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    SwissKnife.inject(this);
  }
}