import React from 'react';
import "./index.css"

function About() {

    return (
        <section className="section content">
            <div className="container pt-5 has-text-light">
                <div>
                    <div className="has-text-centered has-text-light title is-3 is-underlined">About Me</div>

                    <div>
                        <p className="mb-5">
                            Welcome to my Rock Band niche of customs that primarily stem from pop-culture such as fan made music, anime, video games, and so on.
                        </p>
                        <p className="mb-5">
                            I’ve dabbled a bit in authoring back in 2009-2010 with old programs like Feedback, but I didn’t get serious until 2011 posting stuff on <a href="https://rockband.scorehero.com/forum/viewtopic.php?t=34675" className="has-text-info is-underlined" target="_blank" rel="noopener noreferrer">Scorehero</a> back in the day. I’ve also had musical experience playing in my school band throughout middle and high school which had made getting in authoring easier for me.
                        </p>
                        <p className="mb-5">
                            What got me started originally was wanting to chart music from the Brony fandom to play in the game. A few songs down the road I started contacting musicians and majority was willing to send me multi-tracks for the game. I now have over 100 custom songs with multi-tracks included. Now I branch out more to more pop-culture things to chart like video game and anime songs. Every now and then I’ll chart songs from various bands I also like.
                        </p>
                        <p className="mb-5">
                            I was briefly in the RBN BronyAuthoringGroup late 2012 / early 2013. But ultimately we started too late as it was around the time RBN has shutdown. But during that time I’ve learned a lot from both playtesting RBN songs and having my own charts reviewed as well.
                        </p>
                        <p className="mb-5">
                            My favorite instrument to play is Pro Keys so there may be some bias in regards to what I chart for it.
                        </p>
                    </div>
                </div>
                <hr />
                <div>
                    <div className="has-text-centered has-text-light title is-3 is-underlined">Charting Standards</div>

                    <p className="mb-5">
                        I make an effort to keep my charts of high quality, so everything released beyond 2013/2014 I try to keep as my standard:
                    </p>

                    <ul>
                        <li>
                            Full band including Harmonies and Pro Keys if available.
                        </li>
                        <li>
                            All difficulties properly reduced
                        </li>
                        <li>
                            Manual Venue work
                        </li>
                        <li>
                            Left Handed animations for Guitar/Bass/Keys and proper Drum animations charted
                        </li>
                    </ul>
                </div>
                <hr />
                <div className="has-text-centered">
                    <div className="has-text-light title is-3 is-underlined">Website Source Code</div>
                    <a href="https://github.com/LinosM/rb-songs-page" className="has-text-info is-underlined" target="_blank" rel="noopener noreferrer">https://github.com/LinosM/rb-songs-page</a>
                </div>
            </div>
        </section>
    );
}

export default About;
