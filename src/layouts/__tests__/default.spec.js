import { shallowMount } from "@vue/test-utils";
import DefaultLayout from "@/layouts/default";

describe("Default Layout", () => {
  // https://stackoverflow.com/questions/48033841/test-process-env-with-jest
  const OLD_ENV = process.env;
  const BASE_URL = "http://localhost:3000";
  let wrapper;

  beforeEach(() => {
    jest.resetModules(); // this is important - it clears the cache
    process.env = { ...OLD_ENV };

    wrapper = shallowMount(DefaultLayout, {
      stubs: ["nuxt"],
      mocks: {
        $nuxtI18nSeo: () => ({ meta: [{ property: "prop", content: "content" }] })
      }
    });
    process.env.baseUrl = BASE_URL;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("should build the correct meta tags for the page", () => {
    // Given
    const nuxtI18nSeoTag = { property: "prop", content: "content" };
    wrapper.vm.$options.$nuxtI18nSeo = () => ({ meta: [nuxtI18nSeoTag] });
    wrapper.vm.$options.$t = c => c;
    wrapper.vm.$options.$route = { name: "contact__fr", path: "/contact" };

    expect(wrapper.vm.$options.head()).toEqual({
      title: "contact.title",
      htmlAttrs: {},
      link: [],
      meta: [
        nuxtI18nSeoTag,
        { hid: "og:title", property: "og:title", content: "contact.title" },
        { hid: "description", name: "description", content: "contact.description" },
        {
          hid: "og:description",
          property: "og:description",
          content: "contact.description"
        },
        { hid: "og:url", property: "og:url", content: BASE_URL + "/contact" },
        { hid: "og:type", property: "og:type", content: "website" },
        { hid: "twitter:card", name: "twitter:card", content: "summary" }
      ]
    });
  });

  it("should fallback to the meta tags of the index page if $route.name is undefined", () => {
    wrapper.vm.$options.$nuxtI18nSeo = () => ({});
    wrapper.vm.$options.$t = c => c;
    wrapper.vm.$options.$route = { path: "/toto" };

    expect(wrapper.vm.$options.head()).toEqual({
      title: "index.title",
      htmlAttrs: {},
      link: [],
      meta: [
        { hid: "og:title", property: "og:title", content: "index.title" },
        { hid: "description", name: "description", content: "index.description" },
        {
          hid: "og:description",
          property: "og:description",
          content: "index.description"
        },
        { hid: "og:url", property: "og:url", content: BASE_URL + "/toto" },
        { hid: "og:type", property: "og:type", content: "website" },
        { hid: "twitter:card", name: "twitter:card", content: "summary" }
      ]
    });
  });
});
