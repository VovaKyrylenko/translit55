# Releasing

The repository releases itself: every merge to `main` computes a version from the
conventional commits since the last tag, tags it, and publishes GitHub release notes. That
part needs nothing from you.

Publishing to npm does, once.

## The first publish, and why it is manual

npm's trusted publishing (OIDC) removes long-lived tokens, but it cannot be configured for
a package that does not exist yet: npmjs.com requires the package before its OIDC settings
can be edited ([npm/cli#8544](https://github.com/npm/cli/issues/8544), open). So the first
version goes out from a laptop with a token, and every version after it goes out without
one.

1. Create a **granular access token**, scoped to `translit55` only, with write access and
   the shortest expiry offered.
2. `npm publish --access public` from a clean checkout of the tag.
3. On npmjs.com, configure the trusted publisher: this repository, the release workflow.
4. **Revoke the token.** It has done its job; leaving it alive is the whole hazard.
5. Record the date below.

`.npmrc` is in the profile's `SECRET_PATHS` and the guards block committing one. The token
never becomes a repository secret and never reaches CI — that is the point of the sequence.

## Provenance

npm generates a provenance attestation only from a public source repository, which this
one is (C11). Provenance was never a constraint and must not be argued as a reason for
anything; it is a free side effect of a decision taken for other reasons.

## Log

| version    | date | how | token |
| ---------- | ---- | --- | ----- |
| _none yet_ | —    | —   | —     |

The package has not been published. `src/index.ts` is a placeholder until the
transliterator lands, so there is nothing a stranger could usefully install — which also
means constraint C1 ("strangers must be able to use it without asking me") is **not yet
demonstrated**, and the first publish is what will demonstrate it.
