import React from 'react';


const Notification = ({ head, userId }) => {
    return (
        <>
            <a href="#" data-bs-toggle="dropdown" role="button" aria-expanded="false" class="nav-link dropdown-toggle">
                <i class="fa fa-bell" style={{ position: 'relative', top: '4px' }}></i>
                <span class="badge badge-danger notification_badge">55</span>
            </a>

            <div role="menu" class="admintab-wrap menu-setting-wrap menu-setting-wrap-bg dropdown-menu animated zoomIn">
                <div class="tab-content custom-bdr-nt">
                    <div id="Notes" class="tab-pane fade in active">
                        <div class="notes-area-wrap">
                            <div class="note-heading-indicate">
                                <h2><i class="fa fa-comments-o"></i> Notifications</h2>
                                <p>You have 10 new message.</p>
                            </div>
                            <div class="notes-list-area notes-menu-scrollbar">
                                <ul class="notes-menu-list">
                                    <li>
                                        <a href="#">
                                            <div class="notes-list-flow">
                                                <div class="notes-img">
                                                    <img src="assets/contact4.jpg" alt="" />
                                                </div>
                                                <div class="notes-content">
                                                    <p> The point of using Lorem Ipsum is that it has a more-or-less normal.</p>
                                                    <span>Yesterday 2:45 pm</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div class="notes-list-flow">
                                                <div class="notes-img">
                                                    <img src="assets/contact1.jpg" alt="" />
                                                </div>
                                                <div class="notes-content">
                                                    <p> The point of using Lorem Ipsum is that it has a more-or-less normal.</p>
                                                    <span>Yesterday 2:45 pm</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div class="notes-list-flow">
                                                <div class="notes-img">
                                                    <img src="assets/contact2.jpg" alt="" />
                                                </div>
                                                <div class="notes-content">
                                                    <p> The point of using Lorem Ipsum is that it has a more-or-less normal.</p>
                                                    <span>Yesterday 2:45 pm</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div class="notes-list-flow">
                                                <div class="notes-img">
                                                    <img src="assets/contact3.jpg" alt="" />
                                                </div>
                                                <div class="notes-content">
                                                    <p> The point of using Lorem Ipsum is that it has a more-or-less normal.</p>
                                                    <span>Yesterday 2:45 pm</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div class="notes-list-flow">
                                                <div class="notes-img">
                                                    <img src="assets/contact4.jpg" alt="" />
                                                </div>
                                                <div class="notes-content">
                                                    <p> The point of using Lorem Ipsum is that it has a more-or-less normal.</p>
                                                    <span>Yesterday 2:45 pm</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div class="notes-list-flow">
                                                <div class="notes-img">
                                                    <img src="assets/contact1.jpg" alt="" />
                                                </div>
                                                <div class="notes-content">
                                                    <p> The point of using Lorem Ipsum is that it has a more-or-less normal.</p>
                                                    <span>Yesterday 2:45 pm</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div class="notes-list-flow">
                                                <div class="notes-img">
                                                    <img src="assets/contact2.jpg" alt="" />
                                                </div>
                                                <div class="notes-content">
                                                    <p> The point of using Lorem Ipsum is that it has a more-or-less normal.</p>
                                                    <span>Yesterday 2:45 pm</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div class="notes-list-flow">
                                                <div class="notes-img">
                                                    <img src="assets/contact1.jpg" alt="" />
                                                </div>
                                                <div class="notes-content">
                                                    <p> The point of using Lorem Ipsum is that it has a more-or-less normal.</p>
                                                    <span>Yesterday 2:45 pm</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div class="notes-list-flow">
                                                <div class="notes-img">
                                                    <img src="assets/contact2.jpg" alt="" />
                                                </div>
                                                <div class="notes-content">
                                                    <p> The point of using Lorem Ipsum is that it has a more-or-less normal.</p>
                                                    <span>Yesterday 2:45 pm</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <div class="notes-list-flow">
                                                <div class="notes-img">
                                                    <img src="assets/contact3.jpg" alt="" />
                                                </div>
                                                <div class="notes-content">
                                                    <p> The point of using Lorem Ipsum is that it has a more-or-less normal.</p>
                                                    <span>Yesterday 2:45 pm</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Notification;