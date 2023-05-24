import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';
import type { GithubEmail, GithubProfile } from 'next-auth/providers/github';

interface OAuthUserConfigWithScope<P> extends OAuthUserConfig<P> {
  scope?: Array<string>;
}

const createScope = (scope?: Array<string>) => {
  const baseScope = ['read:user', 'user:email'];
  return scope && scope.length > 0
    ? [...baseScope, ...scope].join(' ')
    : baseScope.join(' ');
};

export default function Github<P extends GithubProfile>(
  options: OAuthUserConfigWithScope<P>,
): OAuthConfig<P> {
  const { scope, ...restOptions } = options;

  return {
    id: 'github',
    name: 'GitHub',
    type: 'oauth',
    authorization: {
      url: 'https://github.com/login/oauth/authorize',
      params: { scope: createScope(scope) },
    },
    token: 'https://github.com/login/oauth/access_token',
    userinfo: {
      url: 'https://api.github.com/user',
      async request({ client, tokens }) {
        const profile = await client.userinfo(tokens.access_token!);

        if (!profile.email) {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: { Authorization: `token ${tokens.access_token}` },
          });

          if (res.ok) {
            const emails: GithubEmail[] = await res.json();
            profile.email = (emails.find(e => e.primary) ?? emails[0]).email;
          }
        }

        return profile;
      },
    },
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.login,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    options: restOptions,
  };
}
