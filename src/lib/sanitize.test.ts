import {
  sanitizeString,
  sanitizeHTML,
  sanitizeEmail,
  sanitizeURL,
  sanitizeNumber,
  sanitizeBoolean,
  sanitizeStringArray,
  sanitizeObject,
  validateLength
} from "@/lib/sanitization";

describe("sanitizeString", () => {
  test("removes script tags", () => {
    const input = "<script>alert('xss')</script>Hello";
    expect(sanitizeString(input)).toBe("Hello");
  });

  test("strips HTML entirely", () => {
    expect(sanitizeString("<b>Bold</b>")).toBe("Bold");
  });

  test("returns empty for null", () => {
    expect(sanitizeString(null)).toBe("");
  });
});

describe("sanitizeHTML", () => {
  test("keeps allowed tags", () => {
    const input = "<p><strong>Safe</strong> content</p>";
    expect(sanitizeHTML(input)).toContain("<p>");
    expect(sanitizeHTML(input)).toContain("<strong>");
  });

  test("removes script tags even inside HTML", () => {
    const input = "<p>Hello<script>alert(1)</script></p>";
    expect(sanitizeHTML(input)).toBe("<p>Hello</p>");
  });
});

describe("sanitizeEmail", () => {
  test("accepts valid email", () => {
    expect(sanitizeEmail("  test@example.com ")).toBe("test@example.com");
  });

  test("throws on invalid email", () => {
    expect(() => sanitizeEmail("invalid@@example")).toThrow("Invalid email format");
  });
});

describe("sanitizeURL", () => {
  test("valid URL passes", () => {
    expect(sanitizeURL("https://example.com")).toBe("https://example.com");
  });

  test("invalid URL throws", () => {
    expect(() => sanitizeURL("not a url")).toThrow("Invalid URL format");
  });
});

describe("sanitizeNumber", () => {
  test("converts string to number", () => {
    expect(sanitizeNumber("42")).toBe(42);
  });

  test("throws on invalid number", () => {
    expect(() => sanitizeNumber("abc")).toThrow("Invalid number format");
  });
});

describe("sanitizeBoolean", () => {
  test("interprets 'true' and '1' as true", () => {
    expect(sanitizeBoolean("true")).toBe(true);
    expect(sanitizeBoolean("1")).toBe(true);
  });

  test("interprets false-like strings", () => {
    expect(sanitizeBoolean("false")).toBe(false);
  });
});

describe("sanitizeStringArray", () => {
  test("sanitizes all strings in array", () => {
    const arr = ["<b>Test</b>", "<script>xss()</script>"];
    expect(sanitizeStringArray(arr)).toEqual(["Test"]);

  });
});

describe("sanitizeObject", () => {
  test("recursively sanitizes nested objects", () => {
    const obj = {
      name: "<b>John</b>",
      profile: {
        about: "<script>xss</script>Hello"
      }
    };
    const result = sanitizeObject(obj);
    expect(result).toEqual({
      name: "John",
      profile: { about: "Hello" }
    });
  });
});

describe("validateLength", () => {
  test("throws on too short", () => {
    expect(() => validateLength("abc", "Name", 5, 10))
      .toThrow("Name must be at least 5 characters long");
  });

  test("throws on too long", () => {
    expect(() => validateLength("abcdefghijkl", "Name", 3, 5))
      .toThrow("Name must not exceed 5 characters");
  });
});
