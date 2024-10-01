// The char adjustment table used above
const ADJUSTMENTS = {
  'A': 'E',
  'A': 'I',
  'A': 'O',
  'A': 'U',
  'B': 'V',
  'E': 'I',
  'E': 'O',
  'E': 'U',
  'I': 'O',
  'I': 'U',
  'O': 'U',
  'I': 'Y',
  'E': 'Y',
  'C': 'G',
  'E': 'F',
  'W': 'U',
  'W': 'V',
  'X': 'K',
  'S': 'Z',
  'X': 'S',
  'Q': 'C',
  'U': 'V',
  'M': 'N',
  'L': 'I',
  'Q': 'O',
  'P': 'R',
  'I': 'J',
  '2': 'Z',
  '5': 'S',
  '8': 'B',
  '1': 'I',
  '1': 'L',
  '0': 'O',
  '0': 'Q',
  'C': 'K',
  'G': 'J',
  'E': ' ',
  'Y': ' ',
  'S': ' ',
};

/* JS implementation of the strcmp95 C function written by
Bill Winkler, George McLaughlin, Matt Jaro and Maureen Lynch,
released in 1994 (http://web.archive.org/web/20100227020019/http://www.census.gov/geo/msb/stand/strcmp.c).

a and b should be strings. Always performs case-insensitive comparisons
and always adjusts for long strings. */
function distance(a, b) {
  if (!a || !b) {
    return 0.0;
  }

  a = a.trim().toUpperCase();
  b = b.trim().toUpperCase();
  let a_len = a.length;
  let b_len = b.length;
  let a_flag = [];
  let b_flag = [];
  let search_range = Math.floor(Math.max(a_len, b_len) / 2) - 1;
  let minv = Math.min(a_len, b_len);

  // Looking only within the search range, count and flag the matched pairs. 
  let Num_com = 0;
  let yl1 = b_len - 1;
  for (let i = 0; i < a_len; i += 1) {
    let lowlim = (i >= search_range) ? i - search_range : 0;
    let hilim = ((i + search_range) <= yl1) ? (i + search_range) : yl1;
    for (let j = lowlim; j <= hilim; j += 1) {
      if (b_flag[j] !== 1 && a[j] === b[i]) {
        a_flag[j] = 1;
        b_flag[i] = 1;
        Num_com += 1;
        break;
      }
    }
  }

  // Return if no characters in common
  if (Num_com === 0) { return 0.0; }

  // Count the number of transpositions
  let k = 0; let N_trans = 0;
  for (let i = 0; i < a_len; i += 1) {
    if (a_flag[i] === 1) {
      let j;
      for (j = k; j < b_len; j += 1) {
        if (b_flag[j] === 1) {
          k = j + 1;
          break;
        }
      }
      if (a[i] !== b[j]) { N_trans += 1; }
    }
  }
  N_trans = Math.floor(N_trans / 2);

  // Adjust for similarities in nonmatched characters
  let N_simi = 0;
  if (minv > Num_com) {
    for (let i = 0; i < a_len; i += 1) {
      if (!a_flag[i]) {
        for (let j = 0; j < b_len; j += 1) {
          if (!b_flag[j]) {
            if (ADJUSTMENTS[a[i]] === b[j]) {
              N_simi += 3;
              b_flag[j] = 2;
              break;
            }
          }
        }
      }
    }
  }

  let Num_sim = (N_simi / 10.0) + Num_com;

  // Main weight computation
  let weight = Num_sim / a_len + Num_sim / b_len + (Num_com - N_trans) / Num_com;
  weight = weight / 3;

  // Continue to boost the weight if the strings are similar
  if (weight > 0.7) {
    // Adjust for having up to the first 4 characters in common
    let j = (minv >= 4) ? 4 : minv;
    let i;
    for (i = 0; (i < j) && a[i] === b[i]; i += 1) { }
    if (i) { weight += i * 0.1 * (1.0 - weight) };

    // Adjust for long strings.
    // After agreeing beginning chars, at least two more must agree
    // and the agreeing characters must be more than half of the
    // remaining characters.
    if (minv > 4 && Num_com > i + 1 && 2 * Num_com >= minv + i) {
      weight += (1 - weight) * ((Num_com - i - 1) / (a_len * b_len - i * 2 + 2));
    }
  }
  return weight
};

export { distance };
