export default function ChatBox() {
  return (
    <div className="card card-primary collapsed-card card-outline direct-chat direct-chat-primary">
      <div className="card-header">
        <h3 className="card-title">Direct Chat</h3>
        <div className="card-tools">
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="collapse"
          >
            <i className="fas fa-plus" />
          </button>

          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="remove"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </div>
      {/* /.card-header */}
      <div className="card-body">
        {/* Conversations are loaded here */}
        <div className="direct-chat-messages">
          {/* Message. Default to the left */}
          <div className="direct-chat-msg">
            <div className="direct-chat-infos clearfix">
              <span className="direct-chat-name float-left">
                Alexander Pierce
              </span>
              <span className="direct-chat-timestamp float-right">
                23 Jan 2:00 pm
              </span>
            </div>
            {/* /.direct-chat-infos */}
            <img
              className="direct-chat-img"
              src="/src/dist/img/user1-128x128.jpg"
              alt="Message User Image"
            />
            {/* /.direct-chat-img */}
            <div className="direct-chat-text">
              Is this template really for free? That's unbelievable!
            </div>
            {/* /.direct-chat-text */}
          </div>
          {/* /.direct-chat-msg */}
          {/* Message to the right */}
          <div className="direct-chat-msg right">
            <div className="direct-chat-infos clearfix">
              <span className="direct-chat-name float-right">
                Sarah Bullock
              </span>
              <span className="direct-chat-timestamp float-left">
                23 Jan 2:05 pm
              </span>
            </div>
            {/* /.direct-chat-infos */}
            <img
              className="direct-chat-img"
              src="/src/dist/img/user3-128x128.jpg"
              alt="Message User Image"
            />
            {/* /.direct-chat-img */}
            <div className="direct-chat-text">You better believe it!</div>
            {/* /.direct-chat-text */}
          </div>
          {/* /.direct-chat-msg */}
        </div>
        {/*/.direct-chat-messages*/}
        {/* Contacts are loaded here */}

        {/* /.direct-chat-pane */}
      </div>
      {/* /.card-body */}
      <div className="card-footer">
        <form action="#" method="post">
          <div className="input-group">
            <input
              type="text"
              name="message"
              placeholder="Type Message ..."
              className="form-control"
            />
            <span className="input-group-append">
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </span>
          </div>
        </form>
      </div>
      {/* /.card-footer*/}
    </div>
  );
}
