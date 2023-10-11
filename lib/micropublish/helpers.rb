module Micropublish
  module Helpers
    def h(text)
      Rack::Utils.escape_html(text)
    end

    def flash_message
      if session.key?("flash") && !session[:flash].empty?
        content = %(
          <div class="alert alert-#{session[:flash][:type]}">
            #{session[:flash][:message]}
          </div>
        )
        session.delete("flash")
        content
      end
    end

    def default_format
      if session.key?("format") && session[:format] == :form
        :form
      else
        :json
      end
    end

    def autogrow_script(id)
    end

    def tokenfield_script(id)
      # The old tokenfield package was abandoned in 2015 or so, and depended
      # on jQuery.
      # If we bring back tokenfield functionality we should use something newer
      # https://github.com/KaneCohen/tokenfield is promising, but a slightly
      # heavier payload than I'd like for something that's not core functionality
    end

    def tweet_reply_prefix(tweet_url)
      tweet_match = tweet_url.to_s.match(/twitter\.com\/([A-Za-z0-9_]+)\//)
      tweet_match.nil? ? "" : "@#{tweet_match[1]} "
    end
  end
end
